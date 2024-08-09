export default function updateData(data: any) {
  if (data.ultimoMes === undefined) {
    let ultimoMes = 12;

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
      '1': 'January',
      '2': 'February',
      '3': 'March',
      '4': 'April',
      '5': 'May',
      '6': 'June',
      '7': 'July',
      '8': 'August',
      '9': 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December',
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
    totalAnual.innerText = `Total generated this year: ${data.energíaAnualActual} kWh`;
    totalMensual.innerText = `Total energy this month: ${data.energiaTotalMes} kWh`;
    comparacionAnual.innerText = `vs. ${valorAño} YTD PVSyst: ${data.vsPvsyst}%`;
    comparacionMensual.innerText = `vs. ${valorMes} PVSyst: ${data.vsPvsystMes}%`;
    if (data.añoAnterior === null) {
      vsAnualAnterior.innerText = `vs. ${AñoPasado} YTD PVSyst: No data`;
    } else {
      vsAnualAnterior.innerText = `vs. ${AñoPasado || AñoPasadoDefault}: ${
        data.añoAnterior
      }%`;
    }
    if (data.mesAnterior === null) {
      vsMesAnterior.innerText = `vs. ${valorMes} last year: No data`;
    } else {
      vsMesAnterior.innerText = `vs. ${valorMes} last year: ${data.mesAnterior}%`;
    }

    const inversorName = document.getElementById('inversorName') as HTMLElement;
    const location = document.getElementById('location') as HTMLElement;
    const img = document.createElement('img');
    img.src = 'ubicacion.svg';
    img.alt = 'location icon';
    img.style.width = '30px';
    img.style.height = '30px';

    inversorName.innerText = `Inverter: ${data.inversorName}`;
    location.innerHTML = '';
    location.appendChild(img);

    location.appendChild(document.createTextNode(data.location));
  } else {
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
      '1': 'January',
      '2': 'February',
      '3': 'March',
      '4': 'April',
      '5': 'May',
      '6': 'June',
      '7': 'July',
      '8': 'August',
      '9': 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December',
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
    totalAnual.innerText = `Total generated this year: ${data.energíaAnualActual} kWh`;
    totalMensual.innerText = `Total energy this month: ${data.energiaTotalMes} kWh`;
    comparacionAnual.innerText = `vs. ${valorAño} YTD PVSyst: ${data.vsPvsyst}%`;
    comparacionMensual.innerText = `vs. ${valorMes} PVSyst: ${data.vsPvsystMes}%`;
    if (data.añoAnterior === null) {
      vsAnualAnterior.innerText = `vs. ${AñoPasado} YTD PVSyst: No data`;
    } else {
      vsAnualAnterior.innerText = `vs. ${AñoPasado || AñoPasadoDefault}: ${
        data.añoAnterior
      }%`;
    }
    if (data.mesAnterior === null) {
      vsMesAnterior.innerText = `vs. ${valorMes} last year: No data`;
    } else {
      vsMesAnterior.innerText = `vs. ${valorMes} last year: ${data.mesAnterior}%`;
    }

    const inversorName = document.getElementById('inversorName') as HTMLElement;
    const location = document.getElementById('location') as HTMLElement;
    const img = document.createElement('img');
    img.src = 'ubicacion.svg';
    img.alt = 'location icon';
    img.style.width = '30px';
    img.style.height = '30px';

    inversorName.innerText = `Inverter: ${data.inversorName}`;
    location.innerHTML = '';
    location.appendChild(img);

    location.appendChild(document.createTextNode(data.location));
  }
}
