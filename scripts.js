// Rolagem suave dos carrosséis
const carrosseis = document.querySelectorAll(".produtos");
carrosseis.forEach(carrossel => {
  carrossel.addEventListener("wheel", (e) => {
    e.preventDefault();
    carrossel.scrollLeft += e.deltaY;
  });
});
