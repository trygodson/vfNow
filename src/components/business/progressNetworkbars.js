const ProgressNetworkBars = ({ number = 0 }) => {
  function generateArrayOfObjects(maxHeight) {
    if (typeof maxHeight !== 'number' || maxHeight < 0 || maxHeight > 100) {
      throw new Error('Parameter maxHeight must be a number between 0 and 100');
    }

    const arrayLength = 10;
    const objectsArray = [];

    for (let i = 1; i <= arrayLength; i++) {
      const heightValue = i * 10;
      const coloredValue = heightValue <= maxHeight;

      const newObj = {
        height: heightValue,
        color: coloredValue,
      };

      objectsArray.push(newObj);
    }

    return objectsArray;
  }
  return (
    <div className="d-flex" style={{ height: '180px', alignItems: 'flex-end' }}>
      {generateArrayOfObjects(number).map((item, idx) => (
        <div
          key={idx}
          className="mr-1"
          style={{
            height: `${item.height}%`,
            width: '7px',
            backgroundColor: item.color ? '#ffd306' : 'gray',
            marginRight: '3px',
          }}
        ></div>
      ))}
    </div>
  );
};

export { ProgressNetworkBars };
