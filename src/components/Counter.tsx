import { createSignal } from "solid-js";

const Counter = ({ start }: { start: number }) => {
  const [counter, setCounter] = createSignal(start);
  return (
    <div class="flex items-center text-white justify-center flex-col gap-5">
      {counter()}
      <button
        class="rounded-full text-center px-10 py-5 bg-green-500"
        onClick={() => setCounter(counter() + 1)}
      >
        Click me
      </button>
    </div>
  );
};

export default Counter;
