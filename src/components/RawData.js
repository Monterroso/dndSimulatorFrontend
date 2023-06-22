import React from "react"

const RawData = ({handler}) => {
  return (
    <div>
      <p>
        {handler.changes.map((change, index) => (<span key={index}>
          {JSON.stringify(change)}
        </span>))}
        <br></br>
        Changes
      </p>
      <p>
        {JSON.stringify(handler.objects)}
        <br></br>
        Objects
      </p>
      <p>
        {JSON.stringify(handler.lookup)}
        <br></br>
        Lookup
      </p>
      <p>
        {JSON.stringify(handler.lookupReverse)}
        <br></br>
        ReverseLookup
      </p>
    </div>
  )
}

export default RawData