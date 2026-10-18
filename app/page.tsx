import SiteNavigation from "../components/SiteNavigation";
import ProjectShowcaseCard from "../components/ProjectShowcaseCard";
import DesignProjectFilters from "../components/DesignProjectFilters";
import ScrollRevealObserver from "../components/ScrollRevealObserver";
import CustomCursor from "../components/CustomCursor";
import ContactForm from "../components/ContactForm";
import HudBar from "../components/HudBar";
import Hero from "../components/Hero";
import { 
  Github, Linkedin, Mail,
  Code, Terminal, Palette, Layers, Smartphone, Layout
} from "lucide-react";


// UI/UX Design Projects Data
const uiuxProjects = [
  {
    id: 1,
    title: "Perspective",
    category: "Brand Identity",
    description: "A modern brand identity system exploring depth, vision, and forward-thinking design through minimalist aesthetics and dynamic visual elements.",
    image: "/images/perspective.webp",
    imageWidth: 787,
    imageHeight: 559,
    tags: ["Brand Identity", "Logo Design", "Visual System", "Typography"],
    year: "2026",
    icon: <Layers size={20} />,
    figmaLink: "https://www.figma.com/proto/pUA5KKkTefw804kMQJK5f7/PERSPECTIVE?node-id=2-20&t=QSejd1k3dddzR9Qy-1&starting-point-node-id=2%3A20&scaling=contain&content-scaling=fixed"
  },
{
    id: 2,
    title: "Air Jordan 1 Mid",
    category: "Product Design",
    description: "Sneaker showcase UI with immersive 3D product viewing, colorway customization, and interactive shopping experience for sneaker enthusiasts.",
    image: "/images/NIKE WEB.webp",
    imageWidth: 1440,
    imageHeight: 1024,
    tags: ["Product UI", "3D Integration", "E-Commerce", "Interactive"],
    year: "2026",
    icon: <Smartphone size={20} />,  
    figmaLink: ""  
},
{
    id: 3,
    title: "Alpha Gaming Site",
    category: "Web Design",
    description: "Esports platform design with high-energy visuals, live match tracking, team profiles, and community engagement features for competitive gaming.",
    image: "/images/alpha.webp",
    imageWidth: 864,
    imageHeight: 614,
    tags: ["Gaming UI", "Dashboard", "Community", "Live Data"],
    year: "2026",
    icon: <Layout size={20} />,  
    figmaLink: "https://www.figma.com/proto/fKoihlJ59CfH4NMbedPnIZ/ALPHA-GAMING?node-id=2-2&viewport=663%2C49%2C0.48&t=Vyhu9MERL4JUMOjh-1&scaling=contain&content-scaling=fixed&starting-point-node-id=2%3A2&page-id=0%3A1"
  },
  {
    id: 4,
    title: "Swiflo Wallet",
    category: "Mobile UI",
    description: "Global payments, redefined—fast, secure, and built for a seamless experience across borders.",
    image: "/images/SwifloPoster.webp",
    imageWidth: 1440,
    imageHeight: 1024,
    tags: ["Mobile UI", "Dashboard", "Digital Wallet", "Live Data"],
    year: "2026",
    icon: <Layout size={20} />,  
    figmaLink: "https://www.figma.com/proto/BaLTqr69uB9904Cdb1YECs/SWIFLO?node-id=97-28&p=f&viewport=373%2C416%2C0.11&t=cNWG2LDBcCI9OgqJ-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=12%3A2&show-proto-sidebar=1&page-id=0%3A1"
  },
  {
    id: 5,
    title: "Swiflo Website",
    category: "Web Design",
    description: "Global payments, redefined—fast, secure, and built for a seamless experience across borders.",
    image: "/images/SwifloWebsite.webp",
    imageWidth: 1440,
    imageHeight: 1080,
    tags: ["Web Design", "Dashboard", "Digital Wallet", "Live Data"],
    year: "2026",
    icon: <Layout size={20} />,  
    figmaLink: ""
  },

];

export default function Home() {
  const skills = ["Java", "PHP", "HTML5", "CSS3", "JavaScript", "React.js"];
  const designTools = ["Figma", "Canva"];

  const projects = [
    {
      title: "Hotel Booking System",
      description: "Full-stack reservation platform with real-time availability and secure payments.",
      tech: ["Java", "Springtool", "pgadmin4"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      imageWidth: 1200,
      imageHeight: 800,
      link: "#",
    },
    {
      title: "3D Portfolio",
      description: "Interactive portfolio with 3D elements and smooth scroll animations.",
      tech: ["Next.js", "Three.js", "Framer"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      imageWidth: 1200,
      imageHeight: 800,
      link: "#",
    },
    {
      title: "E-Commerce App",
      description: "Modern shopping platform with cart, auth, and payment integration.",
      tech: ["React", "Redux", "Stripe"],
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      imageWidth: 1200,
      imageHeight: 800,
      link: "#",
    },
    {
      title: "Esport WebSite",
      description: "Collaborative with real-time updates and team features.",
      tech: ["html", "css", "js"],
      image: "/images/alpha.webp",
      imageWidth: 864,
      imageHeight: 614,
      link: "https://aayushpratapsingh.github.io/ESPORT-WTF-WEBSITE/",
    }
  ];

  return (
    <HudBar>
      <ScrollRevealObserver />
      <CustomCursor />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteNavigation />
      <main id="main-content" className="site-shell min-h-screen relative w-full max-w-[100vw]">

      <Hero />

      {/* ABOUT ME SECTION */}
      <section id="about" className="editorial-section editorial-section--spacious about-section">
        <div className="editorial-container editorial-container--narrow">
          <header className="about-heading" data-reveal>
            <span className="about-eyebrow">About Me <span aria-hidden="true">/ 01</span></span>
            <h2>Who is <span>Aayush?</span></h2>
          </header>

          <div className="about-layout">
            <div className="about-story" data-reveal>
              <p className="about-story__lead">
                I&apos;m a <strong>BCA student</strong> passionate about Full Stack Developer and creating intuitive digital experiences. I believe in building applications that are both visually appealing and functionally seamless.
              </p>
              <p className="about-story__detail">
                Over the last 2 years, I&apos;ve worked on diverse projects — from sleek landing pages to complex web apps — constantly learning and refining my craft.
              </p>
              <blockquote className="about-quote">
                <span aria-hidden="true">“</span>
                <p>Building digital solutions that make a difference, one line of code at a time.</p>
              </blockquote>
              <dl className="about-stats">
                {[
                  { num: "2+", label: "Years Experience" },
                  { num: "10+", label: "Projects" },
                  { num: "8+", label: "Technologies" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.num}</dt>
                    <dd>{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside
              className="about-aside"
              aria-label="Personal details and interests"
              data-reveal
            >
              <dl className="about-facts">
                {[
                  { label: "Full Name", value: "Aayush Pratap Singh" },
                  { label: "Location", value: "Nepal" },
                  { label: "Education", value: "BCA - Computer Applications" },
                  { label: "Role", value: "UI / UX Full Stack Developer" },
                ].map((item, index) => (
                  <div className="about-fact" key={item.label}>
                    <dt><span>0{index + 1}</span>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="about-interests">
                <h3>Interests</h3>
                <ul>
                  {["UI Design", "Next.js", "React", "Reading", "Music", "Tech"].map((interest) => (
                    <li key={interest}>{interest}</li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* UI/UX DESIGN SECTION */}
      <section id="design" className="editorial-section editorial-section--spacious project-section">
        <div className="editorial-container">
          <div className="project-section__heading">
            <div>
              <p className="project-section__eyebrow"><Palette size={17} aria-hidden="true" /> UI/UX DESIGN SHOWCASE</p>
              <h2>Creative <span>Design Work</span></h2>
            </div>
            <p>Exploring the intersection of aesthetics and functionality through thoughtful design solutions</p>
          </div>

          <DesignProjectFilters>
            {uiuxProjects.map((project, index) => (
              <ProjectShowcaseCard
                key={project.id}
                title={project.title}
                category={project.category}
                projectCategory={project.category}
                description={project.description}
                image={project.image}
                imageWidth={project.imageWidth}
                imageHeight={project.imageHeight}
                tags={project.tags}
                year={project.year}
                link={project.figmaLink}
                linkLabel="Open prototype"
                icon={project.icon}
                featured={index === 0}
                sizes="(max-width: 700px) 100vw, (max-width: 1100px) 60vw, 58vw"
              />
            ))}
          </DesignProjectFilters>
        </div>
      </section>

      {/* DEVELOPMENT PROJECTS */}
      <section id="work" className="editorial-section editorial-section--spacious project-section">
        <div className="editorial-container">
          <div className="project-section__heading">
            <div>
              <p className="project-section__eyebrow"><Code size={17} aria-hidden="true" /> DEVELOPMENT WORK</p>
              <h2>Recent <span>Projects</span></h2>
            </div>
            <p>Building robust, scalable, and performant web applications with modern technologies</p>
          </div>

          <div className="project-bento project-bento--development">
            {projects.map((project, index) => (
              <ProjectShowcaseCard
                key={project.title}
                title={project.title}
                description={project.description}
                image={project.image}
                imageWidth={project.imageWidth}
                imageHeight={project.imageHeight}
                tags={project.tech}
                link={project.link}
                linkLabel="Open live project"
                icon={<Terminal size={19} aria-hidden="true" />}
                featured={index === 0}
                sizes="(max-width: 700px) 100vw, (max-width: 1100px) 60vw, 58vw"
              />
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="editorial-section editorial-section--spacious skills-section">
        <div className="editorial-container">
          <header className="skills-heading" data-reveal>
            <span className="skills-eyebrow">Expertise <span aria-hidden="true">/ 02</span></span>
            <h2>Technologies &amp; Tools I work with</h2>
          </header>

          <div className="skills-index">
            {[
              { title: "Development", items: skills },
              { title: "UI/UX Design", items: designTools },
            ].map((group, groupIndex) => (
              <section className="skills-group" key={group.title} aria-labelledby={`skills-group-${groupIndex}`}>
                <header className="skills-group__header">
                  <span className="skills-group__number">0{groupIndex + 1}</span>
                  <h3 id={`skills-group-${groupIndex}`}>{group.title}</h3>
                  <span className="skills-group__count">{String(group.items.length).padStart(2, "0")}</span>
                </header>
                <ol className="skills-list">
                  {group.items.map((skill, index) => (
                    <li key={skill} data-reveal>
                      <span className="skills-list__number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="skills-list__name">{skill}</span>
                      <span className="skills-list__rule" aria-hidden="true" />
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="editorial-section editorial-section--spacious bg-white/[0.01] w-full">
        <div className="editorial-container contact-layout">
          <div className="contact-intro" data-reveal>
            <span className="contact-eyebrow">GET IN TOUCH <span aria-hidden="true">/</span> 04</span>
            <h2 className="contact-heading">Let&apos;s make something that matters.</h2>
            <p className="contact-copy">
              I&apos;m currently looking for new opportunities. Whether you have a project in mind or just want to say hello, feel free to reach out.
            </p>
            <a className="contact-direct-link" href="mailto:aayushpratapsingh098@gmail.com">
              aayushpratapsingh098@gmail.com <span aria-hidden="true">↗</span>
            </a>
            <nav className="contact-socials" aria-label="Contact and social links">
              <a 
                href="https://github.com/Aayushpratapsingh" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="contact-social-link motion-control"
              >
                <Github size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/in/aayush-singh-16287b321/" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="contact-social-link motion-control"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="mailto:aayushpratapsingh098@gmail.com" 
                aria-label="Email"
                className="contact-social-link motion-control"
              >
                <Mail size={18} />
              </a>
            </nav>
          </div>
          <div className="contact-form-wrap" data-reveal>
            <ContactForm />
          </div>
        </div>
      </section>

      </main>
      {/* FOOTER */}
      <footer className="site-footer editorial-section">
        <div className="site-footer__inner editorial-container">
          <p>© 2024 Aayush Pratap Singh</p>
          <div className="site-footer__values">
            <span>Clean code</span>
            <span aria-hidden="true">/</span>
            <span>Creative design</span>
            <span aria-hidden="true">/</span>
            <span>User focused</span>
          </div>
          <a className="site-footer__top motion-control" href="#home">Back to top <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </HudBar>
  );
}
