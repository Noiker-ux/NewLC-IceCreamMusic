import style from "./MyFile.module.css";
const MyFile = () => {
  return (
    <label htmlFor="images" className="drop-container" id="dropcontainer">
      <span className="drop-title">Drop files here</span>
      or
      <input type="file" id="images" accept="image/*" required />
    </label>
  );
};
export default MyFile;
