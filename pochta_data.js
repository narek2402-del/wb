// pochta_data.js - База данных и логика для площадок «Почта России»

const pochtaDatabase = [
  { id: 1, name: "ПО_101000", region: "Москва", city: "Москва", address: "Мясницкая ул, 26А, стр.1", lat: 55.764212, lon: 37.637446, traffic: 8273, screens: 20 },
  { id: 2, name: "ПО_105005", region: "Москва", city: "Москва", address: "Бауманская ул, 38, стр.2", lat: 55.771432, lon: 37.677965, traffic: 905, screens: 4 },
  { id: 3, name: "ПО_105037", region: "Москва", city: "Москва", address: "Измайловская пл, 11", lat: 55.794381, lon: 37.774796, traffic: 978, screens: 2 },
  // ... остальные данные интегрируются сюда
];

class PochtaDataTable {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.data = options.data || pochtaDatabase;
    this.filteredData = [...this.data];
    this.init();
  }

  init() {
    this.renderLayout();
    this.bindEvents();
    this.updateTable();
  }

  renderLayout() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="pochta-filter-bar">
        <input type="text" id="pochtaSearch" placeholder="Поиск по адресу, городу или ID..." class="pochta-input">
        <select id="pochtaCityFilter" class="pochta-select">
          <option value="">Все города</option>
        </select>
        <button id="pochtaExportBtn" class="pochta-btn-excel">Выгрузить в Excel</button>
      </div>
      <div class="pochta-table-wrapper">
        <table class="pochta-table">
          <thead>
            <tr>
              <th>№</th>
              <th>ID / Наименование</th>
              <th>Регион</th>
              <th>Город</th>
              <th>Адрес</th>
              <th>Проходимость/сутки</th>
              <th>Экранов</th>
            </tr>
          </thead>
          <tbody id="pochtaTableBody"></tbody>
        </table>
      </div>
    `;
    this.populateCities();
  }

  populateCities() {
    const citySelect = document.getElementById('pochtaCityFilter');
    const cities = [...new Set(this.data.map(item => item.city))].sort();
    cities.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
  }

  bindEvents() {
    document.getElementById('pochtaSearch').addEventListener('input', (e) => this.filterData());
    document.getElementById('pochtaCityFilter').addEventListener('change', (e) => this.filterData());
    document.getElementById('pochtaExportBtn').addEventListener('click', () => this.exportToExcel());
  }

  filterData() {
    const searchQuery = document.getElementById('pochtaSearch').value.toLowerCase();
    const selectedCity = document.getElementById('pochtaCityFilter').value;

    this.filteredData = this.data.filter(item => {
      const matchesSearch = 
        item.address.toLowerCase().includes(searchQuery) ||
        item.city.toLowerCase().includes(searchQuery) ||
        item.name.toLowerCase().includes(searchQuery);
      
      const matchesCity = selectedCity === "" || item.city === selectedCity;

      return matchesSearch && matchesCity;
    });

    this.updateTable();
  }

  updateTable() {
    const tbody = document.getElementById('pochtaTableBody');
    if (!tbody) return;

    if (this.filteredData.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">Ничего не найдено</td></tr>`;
      return;
    }

    tbody.innerHTML = this.filteredData.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${item.name}</strong></td>
        <td>${item.region}</td>
        <td>${item.city}</td>
        <td>${item.address}</td>
        <td>${Math.round(item.traffic)}</td>
        <td>${item.screens}</td>
      </tr>
    `).join('');
  }

  exportToExcel() {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "ID;Регион;Город;Адрес;Проходимость сутки;Экранов\n";

    this.filteredData.forEach(row => {
      csvContent += `"${row.name}","${row.region}","${row.city}","${row.address}","${row.traffic}","${row.screens}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pochta_ad_program.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
