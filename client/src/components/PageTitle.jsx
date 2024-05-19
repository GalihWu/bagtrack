import React from 'react';

function PageTitle({ title, desc }) {
  return (
    <div>
      <h1 className="text-xl my-3" style={{}}>
        {title}
      </h1>
      <p>{desc}</p>
      <hr />
    </div>
  );
}

export default PageTitle;
