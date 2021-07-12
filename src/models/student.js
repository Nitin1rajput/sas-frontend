const STUDENTS = [
  {
    id: "s1",
    isFaculty: false,
    name: "Nitin",
    images:
      "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png",
    class: 1,
    email: "nitin@rmail.com",
    attendence: {
      subject: [
        { id: "1", name: "math", present: 2, total: 4 },
        { id: "2", name: "english", present: 1, total: 4 },
        { id: "3", name: "hindi", present: 4, total: 4 },
      ],
    },
  },
  {
    id: "s2",
    isFaculty: false,
    name: "Priya",
    images:
      "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png",
    class: 2,
    email: "nitin@rmail.com",
    attendence: {
      subject: [
        { id: "1", name: "math", present: 1, total: 4 },
        { id: "2", name: "english", present: 3, total: 4 },
        { id: "3", name: "hindi", present: 4, total: 4 },
      ],
    },
  },
];
export default STUDENTS;
