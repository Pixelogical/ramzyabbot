class Group {
    constructor(IMessageID) {
        this.IMessageID = IMessageID;
        this.input1 = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
        this.input2 = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
        this.row1 = 0;
        this.row2 = 0;
        this.col1 = 0;
        this.col2 = 0;
        this.pc1 = 0;
        this.pp1 = 0;
        this.pc2 = 0;
        this.pp2 = 0;
        this.user1 = -1;
        this.user2 = -1;
        this.username1;
        this.username2;
        this.hash1 = [];
        this.hash2 = [];
        this.board = "";

        this.mode = -1;
        this.dupplicate = -1;

        this.round1 = 0;
        this.round2 = 0;
        this.win = false;

        this.inputs = ""

        this.op1 = 0;
        this.op2 = 0;

        //Inputs that user doesn't submitted yet. like ( 💛 ❤️ - - )
        this.currentInput1 = [];
        this.currentInput2 = [];

        this.turn = this.user1;
    }
}

module.exports = Group;