//ESCAPE

//texto dentro de elementos
export function escape_text(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

//valores dentro de atributos HTML
export function escape_attr(value) {
  return escape_text(value)
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function escape_regex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

//VALIDAÇÃO

//#rgb - #rgba - #rrggbb - #rrggbbaa (qualquer outra coisa vira o fallback)
export function safe_color(value, fallback = "#ffffff") {
  return /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(String(value ?? "")) ? value : fallback;
}

//número finito e não negativo
export function safe_number(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

//número finito
export function finite_number(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

//evitar fechar o atributo com aspas
export function safe_param(value, fallback = "") {
  const text = String(value ?? "").trim();
  if (text === "") return fallback;
  if (!/^[A-Za-z0-9#%.,_()\-+/]+$/.test(text)) return fallback;
  if (/url\s*\(|image|expression|javascript|attr\s*\(/i.test(text)) return fallback;
  return text;
}

//evitar classes fora do comum nos parametros
export function safe_token(value, fallback = "") {
  return /^[A-Za-z0-9-]+$/.test(String(value ?? "")) ? String(value) : fallback;
}

//http(s) - data:image - blob
export function safe_image_src(value) {
  const text = String(value ?? "").trim();
  if (text === "") return "";
  if (/^(?:https?:|data:image\/|blob:)/i.test(text)) return text;
  //esvazia qualquer outra coisa
  if (/^[a-z][a-z0-9+.-]*:/i.test(text)) return "";
  return text;
}

//TOASTS

let toast_timer = null;

export function show_message(text, kind = "info") {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.setAttribute("role", kind === "error" ? "alert" : "status");
  toast.classList.toggle("toast-error", kind === "error");
  toast.textContent = text;
  toast.classList.toggle("hidden", false);
  clearTimeout(toast_timer);
  toast_timer = setTimeout(() => { toast.classList.toggle("hidden", true); }, kind === "error" ? 8000 : 4000);
}

window.show_message = show_message;

//RASCUNHO E ALERTA DE NÃO SALVO

const listeners = [];

export function on_dirty(fn) { listeners.push(fn); }

export function mark_dirty() {
  window.hook = true;
  for (const fn of listeners) fn();
}

export function mark_clean() {
  window.hook = false;
}
