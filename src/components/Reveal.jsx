import { motion } from 'framer-motion'

export default function Reveal({ children, delay = 0, y = 26, className, as = 'div', amount = 0.35 }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}

export function SectionHead({ eyebrow, title, light = false }) {
  return (
    <div className={`section-head ${light ? 'is-light' : ''}`}>
      {eyebrow && (
        <Reveal as="p" className="eyebrow">
          {eyebrow}
        </Reveal>
      )}
      <Reveal as="h2" className="section-title" delay={0.1}>
        {title}
      </Reveal>
    </div>
  )
}
