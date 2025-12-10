document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('.section');
  const buttons = document.querySelectorAll('.nav-button');
  const approvalTableBody = document.getElementById('approvalTableBody');
  const historyTableBody = document.getElementById('historyTableBody');

  const requests = [];

  function renderApproval() {
    approvalTableBody.innerHTML = '';
    requests.filter(r => r.status === 'Awaiting Approval').forEach(r => {
      approvalTableBody.innerHTML += \`
        <tr>
          <td>\${r.employee}</td>
          <td>\${r.department}</td>
          <td>\${r.items.join(', ')}</td>
          <td>\${r.email}</td>
          <td>
            <button onclick="approveRequest('\${r.id}')">Approve</button>
            <button onclick="rejectRequest('\${r.id}')">Reject</button>
          </td>
        </tr>\`;
    });
  }

  function renderHistory() {
    historyTableBody.innerHTML = '';
    requests.filter(r => r.status !== 'Awaiting Approval').forEach(r => {
      historyTableBody.innerHTML += \`
        <tr>
          <td>\${r.employee}</td>
          <td>\${r.items.join(', ')}</td>
          <td>\${r.status}</td>
          <td>\${r.date}</td>
          <td>
            \${r.status === 'Pending' ? '<button onclick="markInProgress(\'' + r.id + '\')">In Progress</button>' : ''}
            \${r.status === 'In Progress' ? '<button onclick="markComplete(\'' + r.id + '\')">Complete</button>' : ''}
          </td>
        </tr>\`;
    });
  }

  document.getElementById('requestForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const newRequest = {
      id: Date.now().toString(),
      employee: formData.get('employee'),
      department: formData.get('department'),
      joinDate: formData.get('joinDate'),
      email: formData.get('email'),
      items: formData.getAll('items'),
      status: 'Awaiting Approval',
      date: new Date().toLocaleDateString()
    };
    requests.push(newRequest);
    this.reset();
    renderApproval();
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-section');
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(target).classList.add('active');
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (target === 'approval') renderApproval();
      if (target === 'history') renderHistory();
    });
  });

  window.approveRequest = function (id) {
    const req = requests.find(r => r.id === id);
    if (req) req.status = 'Pending';
    renderApproval();
  };

  window.rejectRequest = function (id) {
    const req = requests.find(r => r.id === id);
    if (req) req.status = 'Rejected';
    renderApproval();
  };

  window.markInProgress = function (id) {
    const req = requests.find(r => r.id === id);
    if (req) req.status = 'In Progress';
    renderHistory();
  };

  window.markComplete = function (id) {
    const req = requests.find(r => r.id === id);
    if (req) req.status = 'Completed';
    renderHistory();
  };
});