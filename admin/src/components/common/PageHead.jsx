function PageHead({ eyebrow, title, text, children }) {
  return (
    <div className="page-head">
      <div>
        <small>{eyebrow}</small>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      {children}
    </div>
  )
}

export default PageHead
