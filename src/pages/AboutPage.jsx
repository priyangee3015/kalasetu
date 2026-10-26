import Layout from '../components/Layout'

export default function AboutPage() {
  return (
    <Layout>
      <main id="main-content" className="page-about">
        <div className="container">
          <h1>About us</h1>
          <section className="page-about-block"><h2>What is Kalasetu</h2><p className="muted muted-wide">Kalasetu is a bridge between Indian handloom artisans and skilled freelancers. We focus on respectful collaboration—helping makers tell their story and reach new audiences through design, web, and marketing support.</p></section>
          <section className="page-about-block"><h2>Mission</h2><p className="muted muted-wide">Make heritage craft visible and viable: fair presentation, clear communication, and tools that serve the people at the loom.</p></section>
          <section className="page-about-block"><h2>Vision</h2><p className="muted muted-wide">A network where every artisan can find trustworthy digital help, and every freelancer can contribute meaningfully to living traditions.</p></section>
        </div>
      </main>
    </Layout>
  )
}
