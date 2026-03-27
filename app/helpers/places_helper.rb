module PlacesHelper
  def report_category_options
    if portuguese?
      ["Ambiente", "Segurança", "Preconceito", "Assédio", "Violência", "Outros"]
    else
      ["Environment", "Safety", "Discrimination", "Harassment", "Violence", "Other"]
    end
  end

  def report_status_options
    if portuguese?
      [["Positivo", "positive"], ["Negativo", "negative"]]
    else
      [["Positive", "positive"], ["Negative", "negative"]]
    end
  end

  def place_status_label(place)
    case place.status
    when "positive" then portuguese? ? "Seguro" : "Safe"
    when "negative" then portuguese? ? "Evitar" : "Avoid"
    else portuguese? ? "Atenção" : "Attention"
    end
  end
end
