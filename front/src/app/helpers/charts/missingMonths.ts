export function checkForMissingMonths(monthlyData: any[]) {
  const faltanMeses = document.getElementById('faltanMeses?') as HTMLElement;

  console.log(monthlyData);

  faltanMeses.textContent = ``;

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
      .map((month) => getMonthName(month))
      .join(', ');

    faltanMeses.textContent = `It is possible that data is missing for the following months: ${missingMonthsNames}`;
  }

  function getMonthName(monthNumber: number): string {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[monthNumber - 1];
  }
}

export default function getMonthName(monthNumber: number): string {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[monthNumber - 1];
}
