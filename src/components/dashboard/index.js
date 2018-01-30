import m from 'mithril'

class Dashboard {
    constructor(vnode) {
        // vnode.state is undefined at this point
        this.kind = "ES6 class"
    }
    view() {
        return m("div", `Hello from an ${this.kind}`)
    }
    oncreate() {
        console.log(`A ${this.kind} component was created`)
    }
}

export default Dashboard