const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind",
  "Spring Boot",
  "PostgreSQL",
  "Figma",
];

export default function Marquee() {
  return (
    <div className="hero-marquee" aria-label="Technology stack">
      <div className="hero-marquee__track">
        {[0, 1].map((copy) => (
          <ul
            className="hero-marquee__list"
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {technologies.map((technology) => (
              <li className="hero-marquee__item" key={technology}>
                <span aria-hidden="true" />
                {technology}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
