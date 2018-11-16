import React from 'react';

const Table = props => {
  let { data } = props;
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th scope="col">N</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
        </tr>
      </thead>
      <tbody>
        { data.map((x, i) => {
          return (
            <tr key={x}>
              <th scope="row">{i + 1}</th>
              <td>{x.username}</td>
              <td>{x.email}</td>
            </tr>
          );
        }) }
      </tbody>
    </table>
  );
};


export default Table;