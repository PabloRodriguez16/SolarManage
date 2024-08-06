import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { PlantService } from '../../services/plant.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
})
export class HistorialComponent implements OnInit {
  private energyChart: Chart | null = null;
  private dailyChart: Chart | null = null;
  private currentYear: number = new Date().getFullYear();

  constructor(private plantService: PlantService) {}

  ngOnInit() {
    this.createEnergyChart([]);
    this.createDailyChart([]);

    const plantSelect = document.getElementById(
      'plantSelect'
    ) as HTMLSelectElement;
    const monthSelect = document.getElementById('month') as HTMLSelectElement;

    const yearSelect = document.getElementById('year') as HTMLSelectElement;

    const submitButton = document.getElementById(
      'submitButton'
    ) as HTMLButtonElement;

    plantSelect.addEventListener('change', () => {
      const year = parseInt(yearSelect.value, 10);
      const month = parseInt(monthSelect.value, 10);
      this.fetchPlantStats(year, month);
    });

    submitButton.addEventListener('click', () => {
      if (!plantSelect.value) {
        swal({
          title: 'Error',
          text: 'Por favor, selecciona una planta',
          icon: 'error',
          buttons: {
            Aceptar: true,
          },
        });
      } else if (!yearSelect.value || !monthSelect.value) {
        swal({
          title: 'Sugerencia',
          text: 'Si desea ver un mes y año especificos, debe seleccionar ambos',
          icon: 'info',
          buttons: {
            Aceptar: true,
          },
        });
      }
      this.fetchPlantStatsWithMonthYear();
    });
  }

  createEnergyChart(monthlyData: any[]) {
    const ctx = document.getElementById('energyChart') as HTMLCanvasElement;

    if (this.energyChart) {
      this.energyChart.destroy();
    }

    const fullYearData = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyData.find((data) => data.mes - 1 === i);
      return monthData
        ? monthData
        : { mes: i + 1, energiaGeneradaAcumulada: 0, pvsyst: 0 };
    });

    const labels = fullYearData.map((data) => this.getMonthName(data.mes));
    const generatedData = fullYearData.map(
      (data) => data.energiaGeneradaAcumulada
    );
    const expectedData = fullYearData.map((data) => data.pvsyst);

    this.energyChart = new Chart(ctx, {
      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Energía Generada',
            data: generatedData,
            backgroundColor: 'rgba(255, 165, 0, 0.9)',
            borderColor: 'rgba(255, 140, 0, 1)',
            borderWidth: 1,
            barPercentage: 1,
            categoryPercentage: 0.5,
            order: 2,
          },
          {
            type: 'line',
            label: 'Energía Esperada',
            data: expectedData,
            fill: false,
            borderColor: 'rgba(25, 118, 210, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(25, 118, 210, 1)',
            pointBorderColor: 'rgba(21, 101, 192, 1)',
            pointRadius: 3,
            tension: 0.1,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw;
                return `${label}: ${value} kWh`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: '#d3d3d3',
            },
            ticks: {
              autoSkip: true,
              maxRotation: 45,
              minRotation: 0,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: '#d3d3d3',
            },
            title: {
              display: true,
              text: 'Energía (kWh)',
            },
          },
        },
      },
    });
  }

  createDailyChart(dailyData: any[]) {
    const ctx = document.getElementById('dailyChart') as HTMLCanvasElement;

    if (this.dailyChart) {
      this.dailyChart.destroy();
    }

    const fullMonthData = Array.from({ length: 31 }, (_, i) => {
      const dayData = dailyData.find((data) => data.dia - 1 === i);
      return dayData ? dayData : { dia: i + 1, energiaGenerada: 0 };
    });

    const labels = fullMonthData.map((data) => data.dia.toString());
    const generatedData = fullMonthData.map((data) => data.energiaGenerada);

    this.dailyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Energía Generada',
            data: generatedData,
            backgroundColor: 'rgba(255, 165, 0, 0.9)',
            borderColor: 'rgba(255, 140, 0, 1)',
            borderWidth: 1,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw;
                return `${label}: ${value} kWh`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: false,
            grid: {
              display: true,
              color: '#d3d3d3',
            },
            ticks: {
              autoSkip: true,
              maxRotation: 45,
              minRotation: 0,
            },
          },
          y: {
            stacked: false,
            beginAtZero: true,
            grid: {
              display: true,
              color: '#d3d3d3',
            },
            title: {
              display: true,
              text: 'Energía (kWh)',
            },
          },
        },
      },
    });
  }

  async fetchPlantStats(yearSelect?: number, monthSelect?: number) {
    try {
      const plantSelect = document.getElementById(
        'plantSelect'
      ) as HTMLSelectElement;

      const selectedPlant = plantSelect.value;

      if (!yearSelect) {
        const response = await this.plantService.getPlantStats(selectedPlant);

        console.log(response);

        if (response.respuesta) {
          swal({
            title: 'Ups!',
            text: 'It seems that there is not data available on this month. Please select another one.',
            icon: 'error',
            buttons: {
              Accept: true,
            },
          });
          return;
        }

        const year = document.getElementById('year') as HTMLSelectElement;

        year.innerHTML = '';

        year.options[0] = new Option('Selecciona un año', '');

        const availableYears = response.availableYears;

        availableYears.sort((a: number, b: number) => a - b);

        for (const years of availableYears) {
          year.options[year.options.length] = new Option(years, years);
        }

        console.log('Datos recibidos del backend:', response);

        this.createEnergyChart(response.mes_a_mes);
        this.createDailyChart(response.dia_a_dia);
        this.checkForMissingMonths(response.mes_a_mes);

        const ultimoMes = response.mes_a_mes[response.mes_a_mes.length - 1];

        let energiaTotalMes = 0;

        for (const dia of response.dia_a_dia) {
          energiaTotalMes += dia.energiaGenerada;
        }

        const data = {
          inversorName: response.inversor,
          location: response.address,
          energíaAnualActual: response.energíaAnualActual,
          energiaTotalMes: Math.round(energiaTotalMes),
          vsPvsyst: response.añoVsPvsystActual,
          vsPvsystMes: response.mesVsPvsystActual,
          añoAnterior: response.añoVsGeneradaAnterior,
          mesAnterior: response.mesVsGeneradaAnterior,
          ultimoMes: ultimoMes,
        };

        this.updateData(data);
        return;
      }

      if (!selectedPlant) {
        return;
      }

      if (yearSelect && monthSelect) {
        const response = await this.plantService.getPlantStats(
          selectedPlant,
          yearSelect,
          monthSelect
        );

        if (response.respuesta) {
          swal({
            title: 'Ups!',
            text: 'It seems that there is not data available on this month. Please select another one.',
            icon: 'error',
            buttons: {
              Accept: true,
            },
          });
          return;
        }

        console.log('Datos recibidos del backend:', response);

        this.createEnergyChart(response.mes_a_mes);
        this.createDailyChart(response.dia_a_dia);
        this.checkForMissingMonths(response.mes_a_mes);

        const ultimoMes = response.mes_a_mes[response.mes_a_mes.length - 1];

        let energiaTotalMes = 0;

        for (const dia of response.dia_a_dia) {
          energiaTotalMes += dia.energiaGenerada;
        }

        const data = {
          inversorName: response.inversor,
          location: response.address,
          energíaAnualActual: response.energíaAnualActual,
          energiaTotalMes: Math.round(energiaTotalMes),
          vsPvsyst: response.añoVsPvsystActual,
          vsPvsystMes: response.mesVsPvsystActual,
          añoAnterior: response.añoVsGeneradaAnterior,
          mesAnterior: response.mesVsGeneradaAnterior,
          ultimoMes: ultimoMes,
        };

        this.updateData(data);
      } else {
        const response = await this.plantService.getPlantStats(selectedPlant);

        if (response.respuesta) {
          swal({
            title: 'Ups!',
            text: 'It seems that there is not data available on this month. Please select another one.',
            icon: 'error',
            buttons: {
              Accept: true,
            },
          });
          return;
        }

        console.log('Datos recibidos del backend:', response);

        console.log('funciono');
        this.createEnergyChart(response.mes_a_mes);
        this.createDailyChart(response.dia_a_dia);
        this.checkForMissingMonths(response.mes_a_mes);

        const ultimoMes = response.mes_a_mes[response.mes_a_mes.length - 1];

        let energiaTotalMes = 0;

        for (const dia of response.dia_a_dia) {
          energiaTotalMes += dia.energiaGenerada;
        }

        const data = {
          inversorName: response.inversor,
          location: response.address,
          energíaAnualActual: response.energíaAnualActual,
          energiaTotalMes: Math.round(energiaTotalMes),
          vsPvsyst: response.añoVsPvsystActual,
          vsPvsystMes: response.mesVsPvsystActual,
          añoAnterior: response.añoVsGeneradaAnterior,
          mesAnterior: response.mesVsGeneradaAnterior,
          ultimoMes: ultimoMes,
        };

        this.updateData(data);
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }

  checkForMissingMonths(monthlyData: any[]) {
    const faltanMeses = document.getElementById('faltanMeses?') as HTMLElement;

    faltanMeses.textContent = ``;

    console.log('funciono');

    if (monthlyData.length === 0) {
      return;
    }

    const monthsWithData = monthlyData.map((data) => data.mes);
    const firstMonth = Math.min(...monthsWithData);
    const lastMonth = Math.max(...monthsWithData);

    const missingMonths: number[] = [];
    const existingMonths = new Set(monthsWithData);

    for (let i = firstMonth; i <= lastMonth; i++) {
      if (!existingMonths.has(i)) {
        missingMonths.push(i);
      }
    }

    if (missingMonths.length > 0) {
      const missingMonthsNames = missingMonths
        .map((month) => this.getMonthName(month))
        .join(', ');

      faltanMeses.textContent = `Es posible que falten datos para los siguientes meses: ${missingMonthsNames}`;
    }
  }

  async fetchPlantStatsWithMonthYear() {
    try {
      const plantSelect = document.getElementById(
        'plantSelect'
      ) as HTMLSelectElement;
      const monthSelect = document.getElementById('month') as HTMLSelectElement;
      const yearSelect = document.getElementById('year') as HTMLSelectElement;

      const selectedPlant = plantSelect.value;
      const selectedMonth = parseInt(monthSelect.value, 10);
      const selectedYear = parseInt(yearSelect.value, 10);

      if (!selectedPlant || isNaN(selectedMonth) || isNaN(selectedYear)) {
        return;
      }

      await this.fetchPlantStats(selectedYear, selectedMonth);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }

  getMonthName(monthNumber: number): string {
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return monthNames[monthNumber - 1];
  }

  updateData(data: any) {
    let ultimoMes = data.ultimoMes.mes;

    const totalAnual = document.getElementById('totalAnual') as HTMLElement;
    const totalMensual = document.getElementById('totalMes') as HTMLElement;

    const comparacionAnual = document.getElementById(
      'comparacionAnual'
    ) as HTMLElement;
    const comparacionMensual = document.getElementById(
      'comparacionMes'
    ) as HTMLElement;

    const vsMesAnterior = document.getElementById('mesAnterior') as HTMLElement;
    const vsAnualAnterior = document.getElementById(
      'anualAnterior'
    ) as HTMLElement;

    const año = document.getElementById('año') as HTMLSelectElement;
    const optionsAño = document.getElementById('year') as HTMLSelectElement;

    const mes = document.getElementById('mes') as HTMLSelectElement;
    const optionsMes = document.getElementById('month') as HTMLSelectElement;

    let valorAño = optionsAño.value;
    let valorMes = optionsMes.value;

    const meses: { [key: string]: string } = {
      '1': 'Enero',
      '2': 'Febrero',
      '3': 'Marzo',
      '4': 'Abril',
      '5': 'Mayo',
      '6': 'Junio',
      '7': 'Julio',
      '8': 'Agosto',
      '9': 'Septiembre',
      '10': 'Octubre',
      '11': 'Noviembre',
      '12': 'Diciembre',
    };

    if (valorMes in meses) {
      valorMes = meses[valorMes];
    } else {
      valorMes = meses[ultimoMes] || `${ultimoMes}`;
    }

    const AñoPasadoDefault = new Date().getFullYear() - 1;
    const AñoPasado = parseInt(valorAño, 10) - 1;

    año.innerText = `${valorAño || new Date().getFullYear()}`;
    mes.innerText = `${valorMes}`;
    totalAnual.innerText = `Total generado en el año: ${data.energíaAnualActual} kWh`;
    totalMensual.innerText = `Energía total del mes: ${data.energiaTotalMes} kWh`;
    comparacionAnual.innerText = `vs. ${valorAño} YTD PVSyst: ${data.vsPvsyst}%`;
    comparacionMensual.innerText = `vs. ${valorMes} PVSyst: ${data.vsPvsystMes}%`;
    if (data.añoAnterior === null) {
      vsAnualAnterior.innerText = `vs. ${AñoPasado} YTD PVSyst: Sin datos`;
    } else {
      vsAnualAnterior.innerText = `vs. ${AñoPasado || AñoPasadoDefault}: ${
        data.añoAnterior
      }%`;
    }
    if (data.mesAnterior === null) {
      vsMesAnterior.innerText = `vs. ${valorMes} del año anterior: Sin datos`;
    } else {
      vsMesAnterior.innerText = `vs. ${valorMes} del año anterior: ${data.mesAnterior}%`;
    }

    const inversorName = document.getElementById('inversorName') as HTMLElement;
    const location = document.getElementById('location') as HTMLElement;
    const img = document.createElement('img');
    img.src = 'ubicacion.svg';
    img.alt = 'icon ubicacion';
    img.style.width = '30px';
    img.style.height = '30px';

    inversorName.innerText = `Inversor: ${data.inversorName}`;
    location.innerHTML = '';
    location.appendChild(img);

    location.appendChild(document.createTextNode(data.location));
  }
}
