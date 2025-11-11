import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../scss/main.scss';

const burger = document.querySelector('.burger');
const topbar = document.querySelector('.topbar');

if (burger && topbar) {
  burger.addEventListener('click', () => {
    topbar.classList.toggle('is-open');
  });
}

class Brainiac {
  constructor(id, avatar, first_name, last_name, email) {
    this.id = id;
    this.avatar = avatar;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
  }

  getRowHTML() {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${this.id}</td>
      <td><img src="${this.avatar}" alt="Avatar of ${this.first_name} ${this.last_name}" width="50px" height="50px"></td>
      <td>${this.first_name}</td>
      <td>${this.last_name}</td>
      <td>${this.email}</td>
      <td class="action text-end">
        <button class="btn btn-sm text-primary"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn btn-sm text-primary"><i class="fa-solid fa-trash"></i></button>
      </td>`;
      return row;
  }
}
let brainiacs = [];

class ApiClient {
  constructor(xApiKey) {
    this.headers = {
      'Content-Type': 'application/json',
      'x-api-key': xApiKey
    };
  }

  request (method, endpoint, body = null) {
    console.log(`Making ${method} request to ${endpoint}`, {
      headers: this.headers,
      body: body
    });
    const promise = fetch(endpoint, {
      method: method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : null
    });
    return promise;
  }
}
const apiClient = new ApiClient('reqres-free-v1');    
async function getUsers() {
  return await apiClient.request("GET", "https://reqres.in/api/users?page=1")
    .then(response => response.json())
    .then(data => {
      data.data.forEach(user => {
        const brainiac = new Brainiac(user.id, user.avatar, user.first_name, user.last_name, user.email);
        if (brainiacs.find(b => b.id === brainiac.id)) {
          return; // Skip duplicates
        }
        console.log("Brainiacx", brainiac);
        brainiacs.push(brainiac);
      })
      return brainiacs;
    });
}

const refreshTable = async () => {
  const tbody = document.getElementById('brainiac-table-body');
  brainiacs = await getUsers();
  brainiacs.forEach(brainiac => {
      const row = brainiac.getRowHTML();
      tbody.appendChild(row);
    });
};

document.addEventListener('DOMContentLoaded', () => {
  refreshTable();
});