const services = [
  {
    title: 'Landing pages',
    text: 'Use this structure to create focused pages for products, services, or campaigns.',
  },
  {
    title: 'Portfolio sites',
    text: 'Show your work with sections for about, offerings, testimonials, and contact.',
  },
  {
    title: 'Small business websites',
    text: 'Keep navigation simple and make your key information easy to find.',
  },
]

function Services() {
  return (
    <section className="section" id="services">
      <div className="section-title">
        <p className="eyebrow">Services</p>
        <h2>What this basic React structure can become.</h2>
        <p>
          The sections below are intentionally generic so you can rename and reshape
          them for your own project.
        </p>
      </div>

      <div className="card-grid">
        {services.map((service) => (
          <article className="card" key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Services
