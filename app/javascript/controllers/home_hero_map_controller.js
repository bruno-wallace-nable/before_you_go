import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["map", "card", "searchInput"]

  connect() {
    this.defaultCenter = { lng: -51.9253, lat: -14.235, zoom: 4 }
    this.focusCenter = { lng: -47.93, lat: -15.78, zoom: 5 }
    this.typingTimer = null
    this.userLocation = null

    this.renderMap(this.defaultCenter)
    this.locateUser()
  }

  disconnect() {
    clearTimeout(this.typingTimer)
  }

  locateUser() {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        this.userLocation = { lng: coords.longitude, lat: coords.latitude }
        this.renderMap(this.userViewport(false))
      },
      () => {},
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  handleInput() {
    const hasText = this.searchInputTarget.value.trim().length > 0

    if (hasText) {
      this.element.classList.add("home-page--searching")
      this.focusMap()
    } else {
      this.element.classList.remove("home-page--searching")
      this.resetMap()
    }
  }

  handleFocus() {
    if (this.searchInputTarget.value.trim().length > 0) {
      this.element.classList.add("home-page--searching")
    }
  }

  handleBlur() {
    if (this.searchInputTarget.value.trim().length === 0) {
      this.element.classList.remove("home-page--searching")
      this.resetMap()
    }
  }

  focusMap() {
    clearTimeout(this.typingTimer)

    this.typingTimer = setTimeout(() => {
      if (this.userLocation) {
        this.renderMap(this.userViewport(true))
      } else {
        this.renderMap(this.focusCenter)
      }
    }, 250)
  }

  resetMap() {
    if (this.userLocation) {
      this.renderMap(this.userViewport(true))
      return
    }

    this.renderMap(this.defaultCenter)
  }

  renderMap({ lng, lat, zoom }) {
    if (!this.hasMapTarget || !this.mapboxToken) return

    const width = 1280
    const height = 900
    const overlays = this.userLocation ? [`pin-s+2563eb(${this.userLocation.lng},${this.userLocation.lat})`] : []
    const overlayPath = overlays.length > 0 ? `${overlays.join(",")}/` : ""
    const center = `${lng},${lat},${zoom},0`

    this.mapTarget.style.backgroundImage = `url("${this.staticMapUrl(overlayPath, center, width, height)}")`
  }

  userViewport(focused) {
    return {
      lng: focused ? this.userLocation.lng - 0.12 : this.userLocation.lng,
      lat: focused ? this.userLocation.lat - 0.06 : this.userLocation.lat,
      zoom: focused ? 12.4 : 12
    }
  }

  staticMapUrl(overlayPath, center, width, height) {
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${overlayPath}${center}/${width}x${height}?access_token=${this.mapboxToken}`
  }

  get mapboxToken() {
    return this.element.dataset.mapboxKey
  }
}
