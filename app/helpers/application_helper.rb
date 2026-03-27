module ApplicationHelper
  def portuguese?
    I18n.locale.to_s == "pt-BR"
  end
end
