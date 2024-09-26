<script>
  document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
      var messageOuter = document.getElementById('whatswidget-conversation-message-outer');
      messageOuter.style.display = 'block';
      setTimeout(function() {
        messageOuter.classList.add('show');
      }, 100); // Slight delay to trigger CSS transition
    }, 6000); // 6000 milliseconds = 6 seconds
  });
</script>
