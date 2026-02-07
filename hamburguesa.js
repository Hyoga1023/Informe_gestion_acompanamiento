const hamburgerBtn = document.getElementById("hamburgerBtn");
const menuPanel = document.getElementById("menuPanel");

hamburgerBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  menuPanel.style.display = menuPanel.style.display === "flex" ? "none" : "flex";
});

document.addEventListener("click", (e) => {
  if (!menuPanel.contains(e.target) && !hamburgerBtn.contains(e.target)) {
    menuPanel.style.display = "none";
  }
});
