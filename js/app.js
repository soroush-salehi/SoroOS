"use strict";
const $ = selector => document.querySelector(selector);
const NOTES_KEY = "soroos.notes.v1";
let zIndex = 10;
const notes = (() => { try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '""'); } catch { return ""; } })();
function createWindow(name) {
  const existing = document.querySelector('[data-window="' + name + '"]');
  if (existing) { existing.hidden = false; existing.style.zIndex = ++zIndex; return; }
  const win = document.createElement("section");
  win.className = "window"; win.dataset.window = name;
  win.style.zIndex = ++zIndex;
  win.style.left = "calc(50% - 170px)"; win.style.top = "110px";
  const bar = document.createElement("header"); bar.className = "bar";
  const title = document.createElement("b"); title.textContent = name;
  const actions = document.createElement("div");
  const minimize = document.createElement("button"); minimize.type = "button"; minimize.textContent = "—"; minimize.title = "Minimize";
  const close = document.createElement("button"); close.type = "button"; close.textContent = "×"; close.title = "Close";
  actions.append(minimize, close); bar.append(title, actions);
  const inside = document.createElement("div"); inside.className = "inside";
  if (name === "Notes") {
    const area = document.createElement("textarea"); area.placeholder = "Your notes are saved on this device…"; area.value = notes;
    area.addEventListener("input", () => { try { localStorage.setItem(NOTES_KEY, JSON.stringify(area.value)); } catch {} });
    inside.append(area);
  } else if (name === "Files") {
    const heading = document.createElement("h3"); heading.textContent = "Workspace";
    const description = document.createElement("p"); description.textContent = "This browser desktop is a simulation. Files are not connected to your operating system.";
    const openNotes = document.createElement("button"); openNotes.type = "button"; openNotes.textContent = "Open Notes"; openNotes.addEventListener("click", () => createWindow("Notes"));
    inside.append(heading, description, openNotes);
  } else {
    const heading = document.createElement("h2"); heading.textContent = "SoroOS";
    const description = document.createElement("p"); description.textContent = "A desktop-style environment running in your browser.";
    const status = document.createElement("p"); status.className = "muted"; status.textContent = "Prototype · browser sandbox";
    inside.append(heading, description, status);
  }
  win.append(bar, inside); $("#windows").append(win);
  close.addEventListener("click", () => win.remove());
  minimize.addEventListener("click", () => { win.hidden = true; });
  win.addEventListener("pointerdown", () => win.style.zIndex = ++zIndex);
  bar.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    const rect = win.getBoundingClientRect();
    const offsetX = event.clientX - rect.left, offsetY = event.clientY - rect.top;
    bar.setPointerCapture(event.pointerId);
    const move = pointer => {
      const maxX = window.innerWidth - win.offsetWidth;
      const maxY = window.innerHeight - 48;
      win.style.left = Math.max(0, Math.min(maxX, pointer.clientX - offsetX)) + "px";
      win.style.top = Math.max(42, Math.min(maxY, pointer.clientY - offsetY)) + "px";
    };
    const end = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", end); };
    bar.addEventListener("pointermove", move); bar.addEventListener("pointerup", end, { once: true });
  });
}
document.querySelectorAll("[data-app]").forEach(button => button.addEventListener("click", () => createWindow(button.dataset.app)));
function updateClock() { $("#now").textContent = new Intl.DateTimeFormat(undefined, { weekday:"short", hour:"2-digit", minute:"2-digit" }).format(new Date()); }
updateClock(); setInterval(updateClock, 30000); createWindow("About");