const telas = ['login', 'cadastro', 'dashboard', 'agendamento', 'confirmacao'];
const horariosIndisponiveis = ['11:00', '16:00'];

function mostrarTela(tela) {
	telas.forEach((id) => {
		const elemento = document.getElementById(id);
		if (elemento) elemento.classList.toggle('active', id === tela);
	});

	document.body.classList.toggle('modal-open', telas.includes(tela));
	const menu = document.querySelector('.menu');
	if (menu) menu.classList.remove('open');
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fecharTelas() {
	telas.forEach((id) => document.getElementById(id)?.classList.remove('active'));
	document.body.classList.remove('modal-open');
}

function exibirToast(mensagem) {
	const toast = document.getElementById('toast');
	if (!toast) return;
	toast.textContent = mensagem;
	toast.classList.add('show');
	window.setTimeout(() => toast.classList.remove('show'), 3200);
}

function cadastrar(event) {
	event.preventDefault();
	const senha = document.getElementById('cadastroSenha').value;
	const confirmacao = document.getElementById('cadastroConfirmarSenha').value;

	if (senha !== confirmacao) {
		exibirToast('As senhas precisam ser iguais.');
		document.getElementById('cadastroConfirmarSenha').focus();
		return;
	}

	const usuario = {
		nome: document.getElementById('cadastroNome').value.trim(),
		email: document.getElementById('cadastroEmail').value.trim().toLowerCase(),
		telefone: document.getElementById('cadastroTelefone').value.trim(),
		cpf: document.getElementById('cadastroCpf').value.trim(),
		senha
	};

	localStorage.setItem('anabelUsuario', JSON.stringify(usuario));
	document.getElementById('loginEmail').value = usuario.email;
	exibirToast('Cadastro realizado com sucesso!');
	window.setTimeout(() => mostrarTela('login'), 700);
}

function entrar(event) {
	event.preventDefault();
	const email = document.getElementById('loginEmail').value.trim().toLowerCase();
	const senha = document.getElementById('loginSenha').value;
	const usuarioSalvo = JSON.parse(localStorage.getItem('anabelUsuario') || 'null');

	if (usuarioSalvo && (usuarioSalvo.email !== email || usuarioSalvo.senha !== senha)) {
		exibirToast('Confira seu e-mail e senha.');
		return;
	}

	const nome = usuarioSalvo?.nome || email.split('@')[0] || 'Cliente';
	document.getElementById('nomeCliente').textContent = nome.split(' ')[0];
	exibirToast('Bem-vinda ao seu espaço, ' + nome.split(' ')[0] + '!');
	window.setTimeout(() => mostrarTela('dashboard'), 500);
}

function confirmarAgendamento(event) {
	event.preventDefault();
	const data = document.getElementById('data').value;
	const horario = document.getElementById('horario').value;
	const agendamento = {
		servico: document.getElementById('servico').value,
		profissional: document.getElementById('profissional').value,
		data,
		horario
	};

	localStorage.setItem('anabelAgendamento', JSON.stringify(agendamento));
	document.getElementById('resumoServico').textContent = agendamento.servico;
	document.getElementById('resumoProfissional').textContent = agendamento.profissional;
	document.getElementById('resumoData').textContent = new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR');
	document.getElementById('resumoHorario').textContent = horario;
	atualizarProximoAgendamento(agendamento);
	mostrarTela('confirmacao');
}

function atualizarProximoAgendamento(agendamento) {
	const card = document.querySelector('.info-card p');
	if (card && agendamento) {
		card.textContent = `${new Date(`${agendamento.data}T12:00:00`).toLocaleDateString('pt-BR')} às ${agendamento.horario}`;
	}
}

function prepararFormulario() {
	const campoData = document.getElementById('data');
	const campoHorario = document.getElementById('horario');
	if (campoData) {
		campoData.min = new Date().toISOString().split('T')[0];
	}
	if (campoHorario) {
		[...campoHorario.options].forEach((option) => {
			if (horariosIndisponiveis.includes(option.value)) {
				option.disabled = true;
				option.textContent += ' — indisponível';
			}
		});
	}
	const agendamento = JSON.parse(localStorage.getItem('anabelAgendamento') || 'null');
	if (agendamento) atualizarProximoAgendamento(agendamento);
}

document.addEventListener('DOMContentLoaded', () => {
	prepararFormulario();
	const toggle = document.querySelector('.mobile-menu-toggle');
	const menu = document.querySelector('.menu');
	toggle?.addEventListener('click', () => {
		const aberto = menu.classList.toggle('open');
		toggle.setAttribute('aria-expanded', String(aberto));
	});

	document.querySelectorAll('.menu a').forEach((link) => {
		link.addEventListener('click', () => menu?.classList.remove('open'));
	});
});
