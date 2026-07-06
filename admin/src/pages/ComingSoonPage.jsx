import PageHead from '../components/common/PageHead.jsx'

function ComingSoonPage({ title }) {
  return (
    <>
      <PageHead eyebrow="ARIYA ADMIN" title={title} text={`Manage your ${title.toLowerCase()} with the same premium workflow.`} />
      <div className="card empty large">The {title} workspace is ready for backend integration.</div>
    </>
  )
}

export default ComingSoonPage
