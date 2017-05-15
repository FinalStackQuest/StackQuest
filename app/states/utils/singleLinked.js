class ImmutableLinkedList {
	constructor(headNode = null) {
		this.head = headNode
	}
	addToHead(value) {
		const newNode = {
			value: value,
			next: this.head
		}
		return new ImmutableLinkedList(newNode)
	}
	removeFromHead() {
		if(!this.head) return this
		return new ImmutableLinkedList(this.head.next)
	}
}