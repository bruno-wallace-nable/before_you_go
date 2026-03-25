class ReportsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_place, only: %i[create edit update destroy]
  before_action :set_report, only: %i[edit update destroy]

  def create
    existing_report = @place.reports.find_by(user: current_user)

    if existing_report.present?
      redirect_to place_path(@place), alert: "Você já deixou um relato para este local."
      return
    end

    @report = @place.reports.build(report_params)
    @report.user = current_user

    if @report.save
      redirect_to place_path(@place), notice: "Relato enviado com sucesso."
    else
      @reports = @place.reports.includes(:user).order(created_at: :desc)
      @user_report = nil
      render "places/show", status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    unless @report.user == current_user
      redirect_to place_path(@place), alert: "Você não pode editar este relato."
      return
    end

    if @report.update(report_params)
      redirect_to place_path(@place), notice: "Relato atualizado com sucesso."
    else
      @reports = @place.reports.includes(:user).order(created_at: :desc)
      @user_report = @report
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    unless @report.user == current_user
      redirect_to place_path(@place), alert: "Você não pode remover este relato."
      return
    end

    @report.destroy
    redirect_to place_path(@place), notice: "Relato removido com sucesso."
  end

  private

  def set_place
    @place = Place.find(params[:place_id])
  end

  def set_report
    @report = @place.reports.find(params[:id])
  end

  def report_params
    params.require(:report).permit(:category, :status, :description)
  end
end
