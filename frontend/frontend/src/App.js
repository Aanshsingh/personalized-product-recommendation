import { useState } from "react";

function App() {

  const [education, setEducation] = useState("");

  const [interests, setInterests] = useState("");

  const [recommendations, setRecommendations] = useState([]);

  const [name, setName] = useState("");

const [age, setAge] = useState("");

  // GET RECOMMENDATIONS

const getRecommendations = async () => {

  const response = await fetch(
    "http://127.0.0.1:5000/new-recommend",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        age,
        education,
        interests
      })
    }
  );

  const data = await response.json();

  setRecommendations(data);
};


  return (

    <div style={{
      backgroundColor: "#f5f7fb",
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "Arial"
    }}>

      <h1 style={{
        textAlign: "center",
        marginBottom: "20px"
      }}>
        AI Product Recommendation System
      </h1>


      {/* INPUT SECTION */}

      <div style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "15px",
        marginBottom: "40px",
        boxShadow:
          "0px 4px 15px rgba(0,0,0,0.1)"
      }}>

        <h2>User Profile</h2>

          <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

                  <input
          type="number"
          placeholder="Enter Your Age"
          value={age}
          onChange={(e) =>
            setAge(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <input
          type="text"
          placeholder="Enter Education"
          value={education}
          onChange={(e) =>
            setEducation(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <input
          type="text"
          placeholder="Enter Interests"
          value={interests}
          onChange={(e) =>
            setInterests(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={getRecommendations}
          style={{
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#4f46e5",
            color: "white",
            cursor: "pointer"
          }}
        >
          Get Recommendations
        </button>

      </div>


      {/* PRODUCT CARDS */}

      <div style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px"
      }}>

        {
          recommendations.map((item, index) => (

            <div
              key={index}
              style={{
                backgroundColor: "white",
                borderRadius: "15px",
                padding: "20px",
                boxShadow:
                  "0px 4px 15px rgba(0,0,0,0.1)"
              }}
            >

              <img
                src={item.image}
                alt={item.product_name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "15px"
                }}
              />

              <h2>{item.product_name}</h2>

              <p>
                <strong>Category:</strong> {item.category}
              </p>

              <p>
                <strong>Similarity Score:</strong> {item.score}
              </p>

              <button
                onClick={async () => {

await fetch(
  "http://127.0.0.1:5000/save-activity",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      age,
      education,
      interests,
      product_name: item.product_name,
      action: "click"
    })
  }
);

alert("Activity Saved");

                }}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#4f46e5",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                View Product
              </button>

            </div>

          ))
        }

      </div>

    </div>
  );
}

export default App;