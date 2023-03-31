import React, { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import { Select, Slider, Table, InputNumber, Form, Button } from "antd";
import { columns } from "./utils/table-config";

const App = () => {
  const [region, setRegion] = useState("ru");
  const [errorCount, setErrorCount] = useState(0);
  const [seed, setSeed] = useState("");
  const [users, setUsers] = useState([]);

  const handleSeedChange = (e) => {
    setSeed(e);
  };

  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 100000));
  };

  const handleError = (user) => {
    const alphabet =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (let j = 0; j < errorCount; j++) {
      const field = faker.helpers.arrayElement([
        "fullName",
        "address",
        "phone",
      ]);
      const value = user[field];

      if (value.length > 0) {
        const type = Math.floor(Math.random() * 3);

        if (type === 0) {
          const index = Math.floor(Math.random() * value.length);
          user[field] = value.slice(0, index) + value.slice(index + 1);
        } else if (type === 1) {
          const index = Math.floor(Math.random() * (value.length + 1));
          const char = alphabet[Math.floor(Math.random() * alphabet.length)];
          user[field] = value.slice(0, index) + char + value.slice(index);
        } else {
          const index = Math.floor(Math.random() * (value.length - 1));
          user[field] =
            value.slice(0, index) +
            value.charAt(index + 1) +
            value.charAt(index) +
            value.slice(index + 2);
        }
      }
    }
  };

  const generateUsers = (count, usersLength) => {
    const newUsers = [];
    usersLength = usersLength ? usersLength : 0;
    for (let i = 0; i < count; i++) {
      const user = {
        key: usersLength + i + 1,
        index: usersLength + i + 1,
        id: faker.random.numeric(10),
        fullName: faker.name.fullName(),
        address: faker.address.streetAddress(),
        phone: faker.phone.phoneNumber(),
      };

      handleError(user);
      newUsers.push(user);
    }

    return newUsers;
  };

  useEffect(() => {
    faker.setLocale(region);
    faker.seed(+seed);
    setUsers(generateUsers(20));
  }, [region, errorCount, seed]);

  const handleScroll = (e) => {
    const bottom =
      Math.floor(e.target.scrollHeight - e.target.scrollTop) ===
      e.target.clientHeight;
    if (bottom) {
      setUsers([...users, ...generateUsers(10, users.length)]);
    }
  };

  return (
    <div className="p-11">
      <Form className="max-w-lg">
        <Form.Item label={<span className="w-14 text-left">Region</span>}>
          <Select
            value={region}
            onChange={(value) => setRegion(value)}
            options={[
              { value: "ru", label: "Russia" },
              { value: "en", label: "Usa" },
              { value: "de", label: "German" },
            ]}
          />
        </Form.Item>
        <Form.Item label={<span className="w-14 text-left">Error</span>}>
          <div className="flex">
            <Slider
              className="flex-auto"
              min={0}
              max={10}
              onChange={(e) => setErrorCount(e)}
              value={errorCount}
              step={0.01}
            />
            <InputNumber
              min={0}
              max={1000}
              step={0.01}
              value={errorCount}
              onChange={(e) => setErrorCount(e)}
            />
          </div>
        </Form.Item>
        <Form.Item label={<span className="w-14 text-left">Seed</span>}>
          <div className="flex">
            <InputNumber
              className="mr-3 flex-auto"
              value={seed}
              onChange={handleSeedChange}
            />
            <Button onClick={handleRandomSeed}>Random</Button>
          </div>
        </Form.Item>
      </Form>
      <div
        onScroll={handleScroll}
        className="overflow-auto"
        style={{ height: "470px" }}
      >
        <Table
          columns={columns}
          dataSource={users}
          size="middle"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default App;
