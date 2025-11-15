import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../scss/main.scss';

function getFormModalDOM() {
  return document.getElementById('addBrainiacModal');
}

function getFormModalInstance() {
  const modalDOM = getFormModalDOM();
  if (!modalDOM) return null;
  return bootstrap.Modal.getInstance(modalDOM) || bootstrap.Modal.getOrCreateInstance(modalDOM);
}

function getDelModalDOM() {
  return document.getElementById('deleteBrainiacModal');
}

function getDelModalInstance() {
  const modalDOM = getDelModalDOM();
  if (!modalDOM) return null;
  return bootstrap.Modal.getInstance(modalDOM) || bootstrap.Modal.getOrCreateInstance(modalDOM);
}


class Brainiac {
  constructor(id, avatar, first_name, last_name, email) {
    this.id = id;
    this.avatar = avatar;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.deleted = false;
  }

  delete() {
    this.deleted = true;
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
    btnEdit.addEventListener('click', (e) => {
      const modalEdit = getFormModalDOM();
      if (!modalEdit) return;

      const modalInstance = getFormModalInstance();

      const modalTitle = document.getElementById('addBrainiacModalLabel');
      const brainiacIdInput = document.getElementById('brainiacId');
      const firstNameInput = document.getElementById('firstName');
      const lastNameInput = document.getElementById('lastName');
      const emailInput = document.getElementById('email');

      modalEdit.dataset.mode = 'edit';

      modalTitle.textContent = `Edit brainiac [ID: ${this.id}]`;
      brainiacIdInput.value = this.id;
      firstNameInput.value = this.first_name;
      lastNameInput.value = this.last_name;
      emailInput.value = this.email;

      modalInstance.show();
    });

    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn', 'btn-sm', 'text-primary');
    btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
    btnDelete.addEventListener('click', async (e) => {
      const modalDel = getDelModalDOM();
      if (!modalDel) return;
      modalDel.dataset.user_id = this.id;
      const modal = getDelModalInstance();
      document.getElementById('delete-message').textContent = `Are you sure you want to delete brainiac: ${this.first_name} ${this.last_name}?`;
      modal.show();
    });

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
      'x-api-key': xApiKey
    };
  }

  request(method, endpoint, body = null) {
    console.log(`Making ${method} request to ${endpoint}`);
    const url = `${this.baseUrl}${endpoint}`;
    const headers = method === 'POST' || method === 'PUT' ? {
      'Content-Type': 'application/json',
      ...this.headers
    } : this.headers;

    return fetch(url, {
      method,
      headers,
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

  async deleteUser(userId) {
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

  await getUsers();
  const fragment = document.createDocumentFragment();
  brainiacList.forEach(brainiac => {
    if (!brainiac.deleted) { // Only add non-deleted brainiacs
      const row = brainiac.getRowHTML();
      fragment.appendChild(row);
    }
  });
  tbody.innerHTML = '';
  tbody.appendChild(fragment);
};

const handleBrainiacSubmit = async (e) => {
  e.preventDefault();

  const form = document.getElementById('addBrainiacForm');
  if (!form) {
    console.error('Form element not found');
    return;
  }

  const id = document.getElementById('brainiacId').value;
  const first_name = document.getElementById('firstName').value;
  const last_name = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const modal = getFormModalInstance();
  const modalDOM = getFormModalDOM();
  if (!modal || !modalDOM) {
    console.error('Modal instance or DOM not found');
    return;
  }
  const formMode = modalDOM.dataset.mode || 'add';
  try {
    if (formMode === 'add' || !id) {
      const response = await apiClient.createUser({
        first_name,
        last_name,
        email
      });

      if (response.status !== 201) {
        console.error('Failed to create user', response.status);
        alert('Error creating user. Please try again.');
        return;
      }

      const created = await response.json();
      const brainiac = new Brainiac(created.id, 'https://placehold.co/50x50', created.first_name, created.last_name, created.email);
      brainiacList.push(brainiac);
    } else {
      const response = await apiClient.putUser(id, {
        first_name,
        last_name,
        email
      });

      if (!response.ok) {
        console.error('Failed to update user', response.status);
        alert('Error updating user. Please try again.');
        return;
      }

      const brainiac = brainiacList.find(b => String(b.id) === String(id));
      if (brainiac) {
        brainiac.first_name = first_name;
        brainiac.last_name = last_name;
        brainiac.email = email;
      }
    }

    await refreshTable();
    form.reset();
    modal.hide();
  } catch (error) {
    console.error('Error handling user changes:', error);
    alert('Unexpected error. Please try again.');
  }
};

async function deleteUserModal() {
  const modalDel = getDelModalDOM();
  if (!modalDel) return;

  const user_id = modalDel.dataset.user_id;
  if (!user_id) return;
  const response = await apiClient.deleteUser(user_id);
  if (!response.ok) {
    console.error('Failed to delete user', response.status);
    alert('Error deleting user. Please try again.');
    return;
  }

  const brainiac = brainiacList.find(b => String(b.id) === String(user_id));
  if (brainiac) {
    brainiac.delete();
  }

  refreshTable();
  const modal = getDelModalInstance();
  modal.hide();
};


document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const topbar = document.querySelector('.topbar');

  if (burger && topbar) {
    burger.addEventListener('click', () => {
      topbar.classList.toggle('is-open');
    });
  }
  refreshTable();
  document.getElementById('confirmDeleteYes').addEventListener('click', async () => {
    deleteUserModal();
  });
  const form = document.getElementById('addBrainiacForm');
  const modalTitle = document.getElementById('addBrainiacModalLabel');
  const brainiacIdInput = document.getElementById('brainiacId');

  const addBtn = document.getElementById('addBrainiacButton');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const modalEdit = getFormModalDOM();
      modalEdit.dataset.mode = 'add';
      modalTitle.textContent = 'Add new brainiac';
      brainiacIdInput.value = '';
      form.reset();
    });
  }

  if (form) {
    form.addEventListener('submit', handleBrainiacSubmit);
  } else {
    console.error('Form element not found - cannot attach submit event listener');
  }
});