export function getNotes(req, res) {
    res.status(200).send("You have just fetched the notes");
}

export function postNotes(req, res) {
    res.status(200).send("You have just created the notes");
}

export function putNotes(req, res) {
    res.status(200).send("You have just updated the notes");
}

export function deleteNotes(req, res) {
    res.status(200).send("You have just deleted the notes");
}