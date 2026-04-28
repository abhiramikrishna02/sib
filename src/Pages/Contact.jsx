function Contact() {
  return (
    <section className="section" id="contact">
      <div className="section-title">
        <p className="eyebrow">Contact</p>
        <h2>Keep the contact area simple and useful.</h2>
        <p>
          This form is a static starting point. You can connect it to an API or a
          service later if you want submissions to go somewhere.
        </p>
      </div>

      <div className="contact-layout">
        <form className="contact-form">
          <label>
            Name
            <input type="text" name="name" placeholder="Your name" />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="you@example.com" />
          </label>
          <label>
            Message
            <textarea
              name="message"
              rows="5"
              placeholder="Tell us what you want to build"
            />
          </label>
          <button className="primary-btn" type="button">
            Send message
          </button>
        </form>

        <aside className="contact-card card">
          <h3>Quick details</h3>
          <p>
            Add your email, phone number, office location, or social links here as
            your project grows.
          </p>
          <ul className="contact-list">
            <li>Email: hello@example.com</li>
            <li>Phone: +91 00000 00000</li>
            <li>Location: Your city</li>
          </ul>
        </aside>
      </div>
    </section>
  )
}

export default Contact
