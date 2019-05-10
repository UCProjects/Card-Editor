import cardMenu from './menu.js';
import { effects, specials } from './effects.js';

const underlineRegex = new RegExp(`(${effects.join('|')})(?![^{]*})|_([^_]+)_`, 'g');
const colorRegex = new RegExp(`(${specials.join('|')})`, 'g');
const highlightRegex = /\{([^}]+)}/g;

let id = 1;

export let editing = false;

function cardWrapper() {
  const wrapper = document.createElement('span');
  wrapper.className = 'cardWrapper';
  return wrapper;
}

export default function card(monster = true) {
  const wrapper = cardWrapper();
  wrapper.id = `card${id++}`;
  wrapper.innerHTML = `
    <table class="cardBoard ${monster?'monster':'spell'}">
      <tr>
        <td class="name" colspan="3"><span></span><input type="text" maxlength="15" placeholder="Name"></td>
        <td class="cost edit"><span>0</span></td>
      </tr>
      <tr>
        <td class="image" colspan="4">
          <input type="file" accept="image/*">
          <img>
          <img class="tribe none${monster?'':' extra'}" src="./resources/tribes/MONSTER.png">
        </td>
      </tr>
      <tr>
        <td class="description" colspan="4"><div></div><textarea></textarea></td>
      </tr>
      <tr>
        ${monster?'<td class="attack edit"><span>0</span></td>':''}
        <td class="rarity" colspan="${monster?2:4}"><img src="rarity/COMMON.png"></td>
        ${monster?'<td class="health edit"><span>0</span></td>':''}
      </tr>
    </table>
    <span class="footer">undercard.feildmaster.com</span>`;

  // Menu
  const card = wrapper.querySelector('.cardBoard');
  card.oncontextmenu = cardMenu;

  // Name
  const nameCell = wrapper.querySelector('.name');
  nameCell.onclick = editName;
  nameCell.querySelector('input').onblur = finalizeName.bind(nameCell);

  // Numbers
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  wrapper.querySelectorAll('.edit').forEach((cell) => {
    const clone = input.cloneNode();
    const span = cell.querySelector('span');
    span.after(clone);
    cell.onclick = edit.bind(span, clone);
    clone.onblur = finalizeEdit.bind(clone, span);
  });

  // Description
  const description = wrapper.querySelector('.description div');
  const descriptionBox = wrapper.querySelector('.description textarea');
  wrapper.querySelector('.description').onclick = editDescription.bind(description, descriptionBox);
  descriptionBox.onblur = renderDescription.bind(descriptionBox, description);

  // Image
  const imageRow = wrapper.querySelector('.image');
  const image = imageRow.querySelector('input');
  imageRow.onclick = () => image.click();
  image.onchange = readImage.bind(image, imageRow.querySelector('img'));

  // Tribe
  wrapper.querySelector('.tribe').onclick = (e) => e.stopPropagation();

  return wrapper;
}

function editName() {
  editing = true;
  this.querySelector('span').style.display = 'none';
  this.querySelector('input').focus();
  if (this._tippy) {
    this._tippy.show(0);
  }
}

function finalizeName(e = {}) {
  if (this._tippy) {
    if (e.relatedTarget === this._tippy.popper) {
      this.querySelector('input').focus();
      return;
    }
    this._tippy.hide(0);
  }
  editing = false;
  const span = this.querySelector('span');
  const input = this.querySelector('input');
  if (span.textContent !== input.value) {
    editEvent('name');
    span.textContent = input.value;
  }
  span.style.display = '';
}

function edit(input) {
  editing = true;
  this.style.display = 'none';
  input.value = '';
  input.placeholder = this.textContent;
  // Fix firefox's bullshit
  input.keepAlive = true;
  input.focus();
  input.keepAlive = false;
}

function finalizeEdit(span) {
  if (this.keepAlive) return;
  editing = false;
  const newValue = this.value || span.textContent;
  if (span.textContent !== newValue) {
    editEvent(span.parentElement.classList[0]);
    span.textContent = newValue;
  }
  span.style.display = '';
}

function editDescription(input) {
  editing = true;
  this.style.display = 'none';
  input.focus();
  input._oldValue = input.value;
  input._tippy.show(0);
}

function renderDescription(span, e = {}) {
  const tippy = this._tippy;
  if (tippy) {
    if (e.relatedTarget === tippy.popper) return;
    tippy.hide(0);
  }
  editing = false;
  if (this.value !== this._oldValue) {
    editEvent('description');
    span.innerHTML = this.value
      .replace(underlineRegex, (match, $1, $2) => `<span class="underline">${$2||$1}</span>`)
      .replace(colorRegex, (match, $1) => `<span class="${getClass($1)}">${$1}</span>`)
      .replace(highlightRegex, (match, $1) => `<span class="highlight">${$1}</span>`);
  }
  span.style.display = '';
}

function getClass(keyword) {
  switch (keyword) {
    case 'ATK': return 'attack';
    case 'HP': return 'health';
    case 'DMG': return 'damage';
    case 'KR': return 'poison';
  }
}

function readImage(image) {
  if (!(this.files && this.files[0])) return;
  editEvent('image');
  const reader = new FileReader();
  reader.onload = function (e) {
    image.src = e.target.result;
  };
  reader.readAsDataURL(this.files[0]);
}
