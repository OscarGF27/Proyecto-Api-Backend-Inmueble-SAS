/* ===== GESTIÓN DE AUTENTICACIÓN ===== */

let authMode = "login"; // login o register

// Elementos del DOM
const tabLogin = $("#tabLogin");
const tabRegister = $("#tabRegister");
const authTitle = $("#authTitle");
const authSub = $("#authSub");
const nameField = $("#nameField");
const confirmField = $("#confirmField");
const termsField = $("#termsField");
const togglePass = $("#togglePass");
const authForm = $("#authForm");
const formError = $("#formError");
const submitBtn = $("#submitBtn");
const forgotLink = $("#forgotLink");

/* ===== CAMBIAR ENTRE LOGIN Y REGISTRO ===== */
tabLogin.addEventListener("click", () => switchMode("login"));
tabRegister.addEventListener("click", () => switchMode("register"));

function switchMode(mode) {
  authMode = mode;
  
  // Actualizar tabs
  $$(".tab").forEach(t => t.classList.remove("active"));
  $(`#tab${mode === "login" ? "Login" : "Register"}`).classList.add("active");

  // Actualizar títulos
  authTitle.textContent = mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta";
  authSub.textContent = mode === "login" ? "Ingresa tus datos para continuar." : "Completa el formulario para crear tu cuenta.";
  submitBtn.textContent = mode === "login" ? "Iniciar sesión" : "Crear cuenta";

  // Mostrar/ocultar campos
  nameField.hidden = mode === "login";
  confirmField.hidden = mode === "login";
  termsField.hidden = mode === "login";
  forgotLink.parentElement.hidden = mode === "register";

  // Limpiar formulario y errores
  authForm.reset();
  formError.textContent = "";
}

/* ===== TOGGLE CONTRASEÑA ===== */
togglePass.addEventListener("click", e => togglePasswordVisibility(e.currentTarget));

$$(".toggle-pass").forEach(btn => {
  btn.addEventListener("click", e => togglePasswordVisibility(e.currentTarget));
});

function togglePasswordVisibility(btn) {
  const target = btn.getAttribute("data-target") || "password";
  const input = $(`#${target}`);
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  btn.textContent = isPassword ? "Ocultar" : "Mostrar";
}

/* ===== VALIDACIÓN DE FORMULARIO ===== */
function validateForm() {
  const email = $("#email").value.trim();
  const password = $("#password").value;
  const name = $("#name").value.trim();
  const confirm = $("#confirm").value;
  const terms = $("#terms").checked;

  formError.textContent = "";

  // Validaciones comunes
  if (!email) {
    return setError("Por favor ingresa tu correo electrónico");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return setError("El correo electrónico no es válido");
  }
  if (password.length < 6) {
    return setError("La contraseña debe tener al menos 6 caracteres");
  }

  // Validaciones de registro
  if (authMode === "register") {
    if (!name) {
      return setError("Por favor ingresa tu nombre");
    }
    if (password !== confirm) {
      return setError("Las contraseñas no coinciden");
    }
    if (!terms) {
      return setError("Debes aceptar los términos y condiciones");
    }
  }

  return true;
}

function setError(msg) {
  formError.textContent = msg;
  formError.style.color = "var(--error)";
  return false;
}

function setSuccess(msg) {
  formError.textContent = msg;
  formError.style.color = "var(--brand)";
}

/* ===== ENVÍO DEL FORMULARIO ===== */
authForm.addEventListener("submit", async e => {
  e.preventDefault();

  if (!validateForm()) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Procesando...";

  try {
    // Simulación de petición (en producción sería a tu backend)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const email = $("#email").value.trim();
    const name = $("#name").value.trim();
    const password = $("#password").value;

    // Guardar datos en localStorage (SOLO PARA DEMO - En producción usar backend seguro)
    const user = { email, name, password, createdAt: new Date().toISOString() };
    const users = JSON.parse(localStorage.getItem("mf_users")) || [];

    if (authMode === "login") {
      const found = users.find(u => u.email === email && u.password === password);
      if (!found) {
        setError("Correo o contraseña incorrectos");
        submitBtn.disabled = false;
        submitBtn.textContent = authMode === "login" ? "Iniciar sesión" : "Crear cuenta";
        return;
      }
      // Login exitoso
      localStorage.setItem("mf_user", JSON.stringify({ email, name }));
      setSuccess("✓ ¡Bienvenido! Redirigiendo...");
      setTimeout(() => window.location.href = "index.html", 1200);
    } else {
      // Registro
      if (users.some(u => u.email === email)) {
        setError("Este correo ya está registrado");
        submitBtn.disabled = false;
        submitBtn.textContent = "Crear cuenta";
        return;
      }
      users.push(user);
      localStorage.setItem("mf_users", JSON.stringify(users));
      localStorage.setItem("mf_user", JSON.stringify({ email, name }));
      setSuccess("✓ ¡Cuenta creada! Redirigiendo...");
      setTimeout(() => window.location.href = "index.html", 1200);
    }
  } catch (error) {
    setError("Error al procesar la solicitud. Intenta nuevamente.");
    submitBtn.disabled = false;
    submitBtn.textContent = authMode === "login" ? "Iniciar sesión" : "Crear cuenta";
  }
});

/* ===== OLVIDÉ CONTRASEÑA ===== */
forgotLink.addEventListener("click", e => {
  e.preventDefault();
  setError("Enviaremos un enlace de recuperación a tu correo (Feature próximamente)");
});

/* ===== VERIFICAR SESIÓN ACTIVA ===== */
window.addEventListener("load", () => {
  const currentUser = localStorage.getItem("mf_user");
  if (currentUser) {
    // Usuario ya conectado, redirigir a inicio
    const user = JSON.parse(currentUser);
    setSuccess(`✓ Bienvenido de vuelta, ${user.name}!`);
    setTimeout(() => window.location.href = "index.html", 800);
  }
});

/* ===== CERRAR SESIÓN (Para navbar) ===== */
window.logout = () => {
  localStorage.removeItem("mf_user");
  toast("✓ Sesión cerrada correctamente");
  window.location.href = "index.html";
};