// Mostrar/ocultar senha
const toggle = document.getElementById('toggleSenha');
const senha = document.getElementById('senha');

if (toggle && senha) {
    toggle.addEventListener('click', () => {
        senha.type = senha.type === 'password' ? 'text' : 'password';
    });
}

// Máscara simples para CPF e telefone (sem dependências)
const tel = document.getElementById('telefone');
if (tel) {
    tel.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 6) e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
        else if (v.length > 2) e.target.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        else if (v.length > 0) e.target.value = `(${v}`;
    });
}

const cpf = document.getElementById('cpf');
if (cpf) {
    cpf.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 11);
        let out = '';
        if (v.length > 9) out = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
        else if (v.length > 6) out = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
        else if (v.length > 3) out = `${v.slice(0, 3)}.${v.slice(3)}`;
        else out = v;
        e.target.value = out;
    });
}