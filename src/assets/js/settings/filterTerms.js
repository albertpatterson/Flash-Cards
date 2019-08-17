import view from '../utils/view';

const SET_SIZE = 100;
const checkBoxGroupWrapper =
    document.getElementById('sets-checkbox-group-wrapper');
checkBoxGroupWrapper.addEventListener('change', (event) => {
  const availableSetsIdx = event.target.dataset.availableSetsIdx;
  const selected = event.target.checked;
  console.log('checkbox wrapper onchange', event, availableSetsIdx, selected);
  selectedSets[availableSetsIdx] = selected
})

const availableSets = [];
const selectedSets = [];

const okButton = document.getElementById('choose-sets-ok-btn');
let okButtonCallback = null;
okButton.addEventListener('click', () => {
  console.log(selectedSets);
  const selectedRanges = availableSets.filter((_, idx) => selectedSets[idx]);
  const compiledRanges = compileRanges(selectedRanges);

  const filter = function(terms) {
    return terms.filter((_, idx) => {
      idx = idx + 1;
      let inSelectedRange = false;
      for (const selectedRange of compiledRanges) {
        inSelectedRange = idx >= selectedRange[0] && idx <= selectedRange[1];
        if (inSelectedRange) {
          break;
        }
      }
      return inSelectedRange;
    });
  };

  okButtonCallback(filter);
})

function compileRanges(sortedRanges) {
  const compiled = [sortedRanges[0]];
  for (const range of sortedRanges.slice(1)) {
    const lastRange = compiled[compiled.length - 1];
    if (lastRange[1] === range[0] - 1) {
      lastRange[1] = range[1];
    } else {
      compiled.push(range);
    }
  }
  return compiled;
}

const backButton = document.getElementById('choose-sets-back-btn');
backButton.addEventListener('click', () => {
  view.showExclusive('choose-sheets');
})

function filterTerms(terms, callback) {
  if (terms.length <= SET_SIZE) {
    callback(terms);
    return;
  }

  availableSets.splice(0, availableSets.length);
  selectedSets.splice(0, selectedSets.length);
  view.clearWrapperContents(checkBoxGroupWrapper);
  let curMin = 1;
  let curMax = SET_SIZE;
  let idx = 0;
  while (curMin < terms.length) {
    availableSets.push([curMin, curMax]);
    selectedSets.push(false);
    addCheckbox(curMin, curMax, idx++);
    curMin = curMax + 1;
    curMax = Math.min(curMax + SET_SIZE, terms.length);
  }

  okButtonCallback = (filter) => callback(filter(terms));

  view.showExclusive('choose-sets');
}

function addCheckbox(startValue, endValue, availableSetsIdx) {
  const rangeLabel = `${startValue}-${endValue}`;
  const id = `sets-checkbox-${rangeLabel}`;
  //   const groupWrapperId = 'sets-checkbox-group-wrapper';
  const checkboxWrapperClass = 'set-checkbox-wrapper'
  //   const groupWrapper = document.getElementById(groupWrapperId);

  const checkboxWrapper = document.createElement('div');
  checkboxWrapper.classList.add(checkboxWrapperClass);
  checkBoxGroupWrapper.appendChild(checkboxWrapper);

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.classList.add('checkbox');
  cb.id = id;
  cb.dataset.availableSetsIdx = availableSetsIdx;
  checkboxWrapper.appendChild(cb)

  const lab = document.createElement('label');
  lab.for = id;
  cb.classList.add('label');
  lab.innerText = rangeLabel;
  checkboxWrapper.appendChild(lab);
}

export default filterTerms;