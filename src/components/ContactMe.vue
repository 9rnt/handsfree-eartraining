<template>
  <div id="contact-form">
    <p>I always welcome any feedback or contribution. Feel free to send me anything and I'll get back to you as soon as possible or take your comments into account.</p>
    <form action="https://formspree.io/f/mwkggzwq" method="POST">
      <label for="name">Your Name:</label>
      <input type="text" id="name" name="name" required>

      <label for="email">Your Email:</label>
      <input type="email" id="email" name="_replyto" required>

      <label for="message">Your Message:</label>
      <textarea id="message" name="message" required></textarea>

      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ContactForm'
}
</script>

<style scoped>
#contact-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 50%;
    margin: auto;
}

#contact-form form {
    display: flex;
    flex-direction: column;
    width: 100%;
}

#contact-form label {
    margin: 10px 0 5px 0;
    font-weight: bold;
}

#contact-form input, #contact-form textarea {
    border: 1px solid black;
    padding: 10px;
    margin-bottom: 20px;
    resize: none;
}

#contact-form textarea {
    height: 150px;
}

#contact-form button {
    border: none;
    padding: 10px 20px;
    background-color: black;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

#contact-form button:hover {
    background-color: #444;
}
</style>