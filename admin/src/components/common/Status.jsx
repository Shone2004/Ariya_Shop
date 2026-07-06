function Status({ value }) {
  return <span className={`status ${String(value).toLowerCase().replace(' ', '-')}`}>{value}</span>
}

export default Status
