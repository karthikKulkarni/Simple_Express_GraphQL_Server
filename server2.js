var express = require("express");
var express_graphql = require("express-graphql");
const cors = require("cors");
var { buildSchema } = require("graphql");

//Schema
var schema = buildSchema(`
    type Query {
      message:String
      course(id:Int!):Course
      allCourses:[Course]
      coursesForId(id:Int!):[Course]
      coursesForTopic(topic:String):[Course] 
    }

    type Mutation {
      updateCourseTopic(id:Int!, topic:String):Course
      addNewCourse(id:Int!,
        title:String,
        author:String,
        description:String,
        topic:String,
        url:String ): [Course]
    }

    type Course {
      id:Int,
      title:String,
      author:String,
      description:String,
      topic:String,
      url:String
    }
`);

var courseData = [
  {
    id: 1,
    title: "Course_1",
    author: "Course_1_Author",
    description: "Course_1_Dec",
    topic: "Course_1_Topic",
    url: "https://frontendmasters.com/courses/intermediate-react-v2/"
  },
  {
    id: 2,
    title: "Course_2",
    author: "Course_2_Author",
    description: "Course_2_Dec",
    topic: "Course_2_Topic",
    url: "https://designcode.io/react-native-2"
  },
  {
    id: 3,
    title: "Course_3",
    author: "Course_3_Author",
    description: "Course_3_Dec",
    topic: "Course_1_Topic",
    url: "https://leanpub.com/reintroducing-react"
  }
];

getCourse = args => {
  var id = args.id;
  var course = courseData.filter(course => {
    return course.id == id;
  });

  return course[0];
};

getAllCourses = () => {
  return courseData;
};

getCoursesForId = args => {
  if (args.id !== -1) {
    var id = args.id;
    return courseData.filter(course => {
      return course.id == id;
    });
  } else {
    return courseData;
  }
};

getCoursesForTopic = args => {
  if (args.topic) {
    var topic = args.topic;
    return courseData.filter(course => {
      return course.topic == topic;
    });
  } else {
    return courseData;
  }
};

updateCourseTopic = ({ id, topic }) => {
  courseData.map(course => {
    if (course.id == id) {
      course.topic = topic;
    }
  });
  return courseData.filter(course => {
    return course.id == id;
  })[0];
};

addNewCourse = ({ id, title, author, description, url, topic }) => {
  courseData[id] = { id, title, author, description, url, topic };

  return courseData;
};

//Root Resolver
var root = {
  message: () => "Hello",
  course: getCourse,
  allCourses: getAllCourses,
  coursesForId: getCoursesForId,
  coursesForTopic: getCoursesForTopic,
  updateCourseTopic: updateCourseTopic,
  addNewCourse: addNewCourse
};

//Express server
var app = express();
app.use(cors());
app.use(
  "/graphql",
  express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(4000, () =>
  console.log("Express GraphQl at localhost:4000/graphql")
);
