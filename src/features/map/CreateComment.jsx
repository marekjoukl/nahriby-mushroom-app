function CreateComment() {
  return (
    <form>
      <label>
        Comment:
        <input type="text" name="comment" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default CreateComment;
