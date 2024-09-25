  // JavaScript para abrir e fechar o modal
  document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('contactModal');
    const btn = document.getElementById('openModalBtn');
    const span = document.querySelector('.close');

    btn.addEventListener('click', function() {
      modal.style.display = "flex";
    });

    span.addEventListener('click', function() {
      modal.style.display = "none";
    });

    window.addEventListener('click', function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  });