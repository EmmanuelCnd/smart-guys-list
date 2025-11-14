import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../scss/main.scss';

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
    const tdId = document.createElement('td');
    tdId.textContent = this.id;
    const tdAvatar = document.createElement('td');
    const imgAvatar = document.createElement('img');
    imgAvatar.src = this.avatar;
    imgAvatar.alt = 'Avatar';
    imgAvatar.width = 50;
    imgAvatar.height = 50;
    tdAvatar.appendChild(imgAvatar);
    const tdFirstName = document.createElement('td');
    tdFirstName.textContent = this.first_name;
    const tdLastName = document.createElement('td');
    tdLastName.textContent = this.last_name;
    const tdEmail = document.createElement('td');
    tdEmail.textContent = this.email;
    const tdAction = document.createElement('td');
    tdAction.classList.add('action', 'text-end');
    const btnEdit = document.createElement('button');
    btnEdit.classList.add('btn', 'btn-sm', 'text-primary');
    btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn', 'btn-sm', 'text-primary');
    btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
    tdAction.appendChild(btnEdit);
    tdAction.appendChild(btnDelete);
    row.appendChild(tdId);
    row.appendChild(tdAvatar);
    row.appendChild(tdFirstName);
    row.appendChild(tdLastName);
    row.appendChild(tdEmail);
    row.appendChild(tdAction);
      return row;
  }
}
const brainiacList = [];

class ApiClient {
  constructor(baseUrl, xApiKey) {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      'x-api-key': xApiKey
    };
  }

  request (method, endpoint, body = null) {
    console.log(`Making ${method} request to ${endpoint}`);
    const url = `${this.baseUrl}${endpoint}`;
    return fetch(url, {
      method: method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : null
    });
  }
  get(endpoint) {
    return this.request('GET', endpoint);
  }
  post(endpoint, body) {
    return this.request('POST', endpoint, body);
  }
  
  getUser(userId) {
    return this.get(`/api/users/${userId}`);
  }

  put(endpoint, body) {
    return this.request('PUT', endpoint, body);
  }
  putUser(userId, body) {
    return this.put(`/api/users/${userId}`, body);
  }
  getUsers(page = 1, perpage = 6) {
    console.log(`Fetching users - Page: ${page}, Per Page: ${perpage}`);
    return this.get(`/api/users?page=${page}&per_page=${perpage}`);
  }

  delete(endpoint) {
    return this.request('DELETE', endpoint);
  }
  deleteUser(userId) {
    return this.delete(`/api/users/${userId}`);
  }
  async createUser(body) {
    console.log('createUser called');
    return this.post('/api/users', body);
  }
}

const apiClient = new ApiClient('https://reqres.in', 'reqres-free-v1');    
async function getUsers() {
  try {
    const users = await apiClient.getUsers();
    if (!users.ok) {
      console.error('Failed to fetch users', users.status);
      return [];
    }
    const responseJson = await users.json();
    responseJson.data.forEach(user => {
      const brainiac = new Brainiac(user.id, user.avatar, user.first_name, user.last_name, user.email);
      if (brainiacList.find(b => b.id === brainiac.id)) {
        return; // Skip duplicates
      }
      brainiacList.push(brainiac);
    })
    return brainiacList;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

const refreshTable = async () => {
  const tbody = document.getElementById('brainiac-table-body');
  tbody.innerHTML = '';
  await getUsers();
  brainiacList.forEach(brainiac => {
      const row = brainiac.getRowHTML();
      tbody.appendChild(row);
    });
};

const createNewUser = (async (e) => {
  try {
    e.preventDefault();
    const form = document.getElementById('addBrainiacForm');
    if (!form) {
      console.error('Form element not found');
      return;
    }
    const first_name = document.getElementById('firstName').value;
    const last_name = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    
    const response = await apiClient.createUser({
      first_name: first_name,
      last_name: last_name,
      email: email
    });

    if (response.status !== 201) {
      console.error('Failed to create user', response.status);
      alert('Error creating user. Please try again.');
      return;
    }

    const created = await response.json();
    const brainiac = new Brainiac(created.id, 'https://placehold.co/50x50', created.first_name, created.last_name, created.email);
    brainiacList.push(brainiac);
    const modalBrainiac = document.getElementById('addBrainiacModal');
    const modal = bootstrap.Modal.getInstance(modalBrainiac);
    refreshTable();
    form.reset();
    if (!modal) {
      console.error('Modal instance not found');
      alert("Can't hide modal after creating user");
      return;
    }
    modal.hide();
  } catch (error) {
    console.error('Error creating user:', error);
    alert('Error creating user. Please try again.');
  }
});

document.addEventListener('DOMContentLoaded', () => {  
    const burger = document.querySelector('.burger');
    const topbar = document.querySelector('.topbar');

    if (burger && topbar) {
      burger.addEventListener('click', () => {
        topbar.classList.toggle('is-open');
      });
    }
    refreshTable();
    const form = document.getElementById('addBrainiacForm');
    if (form) {
      form.addEventListener('submit', createNewUser);
    } else {
      console.error('Form element not found - cannot attach submit event listener');
    }
});
