const input = document.querySelector("#phone");
const iti = window.intlTelInput(input, {
  utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
  autoPlaceholder: "aggressive"
});

input.addEventListener("input", function () {
    const formattedNumber = iti.getNumber(intlTelInputUtils.numberFormat.INTERNATIONAL);
    iti.setNumber(formattedNumber);
  });