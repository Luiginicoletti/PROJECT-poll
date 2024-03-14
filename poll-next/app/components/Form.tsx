"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

const Form: React.FC = (props) => {
  const [titulo, setTitulo] = useState<string>("");
  const [opcoes, setOpcoes] = useState<string[]>(Array(4).fill(""));
  const [lastId, setLastId] = useState<string>("");
  const [lastIdView, setLastIdView] = useState<boolean>(false);
  const [lastIdData, setLastIdData] = useState<{}>();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedVote, setSelectedVote] = useState(null);

  const handleTituloChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitulo(event.target.value);
  };

  const handleOpcaoChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const novasOpcoes = [...opcoes];
      novasOpcoes[index] = event.target.value;
      setOpcoes(novasOpcoes);
    };

  const handleCheck = async () => {
    if (!lastId) {
      return;
    }
    const res = await fetch(`http://localhost:3333/polls/${lastId}`);
    const data = await res.json();
    setLastIdView(true);
    setLastIdData(data.poll);
  };

  const handleSelectVote = async (opt, index) => {
    setSelectedItem(opt);
    setSelectedVote(lastIdData.options[index]);
    console.log(selectedItem);
    console.log(selectedVote);
  };

  const handleSubmitVote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3333/polls/${lastId}/votes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pollOptionId: selectedVote }),
        },
      );
      console.log("enviado");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitPoll = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3333/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: titulo, options: opcoes }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.pollId) {
          const novoId = data.pollId;
          setLastId(novoId);
          console.log("ID", novoId);
        } else {
          console.log(
            "A propriedade 'poll' ou 'id' não está presente nos dados.",
          );
        }
        console.log("Dados enviados com sucesso!");
      } else {
        console.log("Erro ao enviar os dados.");
      }
    } catch (error) {
      console.error("Erro durante a requisição:", error);
    }
  };

  return (
    <>
      {lastIdData ? (
        <div className=" flex flex-col h-full">
          <div className=" m-2 flex flex-col">
            <h1 className="text-4xl mb-2 text-white">{lastIdData.title}</h1>

            <form>
              {lastIdData.options.map((opt, index) => (
                <label
                  key={opt.title}
                  className={`flex flex rounded-lg p-4 bg-white/30 mb-2 cursor-pointer ${
                    selectedItem === opt.title ? "bg-cyan-400" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    onChange={() => handleSelectVote(opt.title, index)}
                    checked={selectedItem === opt.title}
                    className="invisible"
                  />
                  <p className="text-white text-2xl">{opt.title}</p>
                </label>
              ))}
            </form>
          </div>
          <div className="gap-2 justify-center items-end flex">
            <button
              type="submit"
              className={`mt-10 w-1/3 h-8 bg-cyan-400 text-white disabled:animate-none animate-pulse rounded-md disabled:bg-white/10 disabled:cursor-wait
`}
              disabled={selectedItem === null}
              onClick={handleSubmitVote}
            >
              Vote
            </button>

            <button
              type="button"
              onClick={handleCheck}
              className="mt-10 w-1/3 h-8 bg-white/60 rounded-md"
            >
              Next Poll
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitPoll} className="flex flex-col gap-4 p-4">
          <label className="text-2xl text-white">
            Título:
            <input
              type="text"
              value={titulo}
              onChange={handleTituloChange}
              className="w-full bg-white/30 text-white rounded-md h-9 p-2"
            />
          </label>
          {opcoes.map((opcao, index) => (
            <label key={index} className="text-white">
              Opção {index + 1}:
              <input
                type="text"
                value={opcao}
                onChange={handleOpcaoChange(index)}
                className="w-full rounded-md h-8 bg-white/30 p-2"
              />
            </label>
          ))}
          <div className="gap-2 justify-center items-end flex">
            <button
              type="submit"
              className="mt-10 w-1/3 h-8 bg-white/60 rounded-md"
            >
              Register
            </button>

            <button
              type="button"
              onClick={handleCheck}
              className="mt-10 w-1/3 h-8 bg-white/60 rounded-md"
            >
              Last Poll
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default Form;
