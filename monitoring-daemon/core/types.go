package core

type URL struct {
	Type      string
	Sk        string
	CreatedOn string
	UserId    int
}

type Snapshot struct {
	Sk        string
	CreatedOn string
	UserId    int
	Content   string
}
