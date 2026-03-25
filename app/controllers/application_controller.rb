class ApplicationController < ActionController::Base
  before_action :set_locale
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name])
  end

  def default_url_options
    { locale: I18n.locale }
  end

  private

  def set_locale
    requested_locale = params[:locale]&.to_sym
    I18n.locale = I18n.available_locales.include?(requested_locale) ? requested_locale : I18n.default_locale
  end
end
