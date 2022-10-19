const expirationSelect = document.querySelector("[data-expiration-year]")
const logo = document.querySelector("[data-logo]")

const currentYear = new Date().getFullYear()
for (let i = currentYear; i < currentYear + 10; i++) {
  const option = document.createElement("option")
  option.value = i
  option.innerText = i
  expirationSelect.append(option)
}

document.addEventListener("keydown", e => {
  const input = e.target
  const key = e.key
  if (!isConnectedInput(input)) return

  switch (key) {
    case "ArrowLeft": {
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        const prev = input.previousElementSibling
        prev.focus()
        prev.selectionStart = prev.value.length - 1
        prev.selectionEnd = prev.value.length - 1
        e.preventDefault()
      }
      break
    }
    case "ArrowRight": {
      if (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
      ) {
        const next = input.nextElementSibling
        next.focus()
        next.selectionStart = 1
        next.selectionEnd = 1
        e.preventDefault()
      }
      break
    }
    case "Delete": {
      if (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
      ) {
        const next = input.nextElementSibling
        next.value = next.value.substring(1, next.value.length)
        next.focus()
        next.selectionStart = 0
        next.selectionEnd = 0
        e.preventDefault()
      }
      break
    }
    case "Backspace": {
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        const prev = input.previousElementSibling
        prev.value = prev.value.substring(0, prev.value.length - 1)
        prev.focus()
        prev.selectionStart = prev.value.length
        prev.selectionEnd = prev.value.length
        e.preventDefault()
      }
      break
    }
    default: {
      if (e.ctrlKey || e.altKey) return
      if (key.length > 1) return
      if (key.match(/^[^0-9]$/)) return e.preventDefault()

      e.preventDefault()
      onInputChange(input, key)
    }
  }
})

document.addEventListener("paste", e => {
  const input = e.target
  const data = e.clipboardData.getData("text")

  if (!isConnectedInput(input)) return
  if (!data.match(/^[0-9]+$/)) return e.preventDefault()

  e.preventDefault()
  onInputChange(input, data)
})

function onInputChange(input, newValue) {
  const start = input.selectionStart
  const end = input.selectionEnd
  updateInputValue(input, newValue, start, end)
  focusInput(input, newValue.length + start)
  const firstFour = input
    .closest("[data-connected-inputs]")
    .querySelector("input").value

  if (firstFour.startsWith("4")) {
    logo.src = "visa.svg"
  } else if (firstFour.startsWith("5")) {
    logo.src = "mastercard.svg"
  }
}

function updateInputValue(input, extraValue, start = 0, end = 0) {
  const newValue = `${input.value.substring(
    0,
    start
  )}${extraValue}${input.value.substring(end, 4)}`
  input.value = newValue.substring(0, 4)
  if (newValue > 4) {
    const next = input.nextElementSibling
    if (next == null) return
    updateInputValue(next, newValue.substring(4))
  }
}

function focusInput(input, dataLength) {
  let addedChars = dataLength
  let currentInput = input
  while (addedChars > 4 && currentInput.nextElementSibling != null) {
    addedChars -= 4
    currentInput = currentInput.nextElementSibling
  }
  if (addedChars > 4) addedChars = 4

  currentInput.focus()
  currentInput.selectionStart = addedChars
  currentInput.selectionEnd = addedChars
}

function isConnectedInput(input) {
  const parent = input.closest("[data-connected-inputs]")
  return input.matches("input") && parent != null
}
