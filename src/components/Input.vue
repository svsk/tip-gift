<script setup lang="ts">
import { clear } from 'console';

interface Props {
    id?: string;
    modelValue?: string | number | null;
    label?: string;
    inputClass?: string;
    type?: string;
    step?: string;
    readonly?: boolean;
    rules?: ((v: any) => string | boolean)[];
    name?: string;
    debounce?: number;
}

const props = withDefaults(defineProps<Props>(), {
    id:
        'v-input-' +
        Math.floor(Math.random() * 99999999)
            .toString()
            .padStart(8, '0'),
    type: 'text',
    readonly: false,
    debounce: 0,
});

const validators = inject<(() => boolean)[]>('formValidators', []);
const emit = defineEmits(['update:modelValue']);
const errorMessage = ref<string | null>(null);
const value = ref(props.modelValue);
const input = ref<HTMLInputElement>();
let to: NodeJS.Timeout | undefined = undefined;

watch(
    () => props.modelValue,
    () => (value.value = props.modelValue)
);

watch(
    () => value.value,
    () => {
        const doUpdate = () => {
            errorMessage.value = null;

            if (value.value !== props.modelValue) {
                emit('update:modelValue', value.value);
            }
        };

        if (props.debounce > 0) {
            clearTimeout(to);
            to = setTimeout(doUpdate, props.debounce);
        } else {
            doUpdate();
        }
    }
);

const focus = () => {
    input.value?.focus();
};

const validate = () => {
    const brokenRule = props.rules?.map((rule) => rule(value.value)).find((result) => result !== true);
    if (brokenRule !== true && brokenRule !== false && !!brokenRule) {
        errorMessage.value = brokenRule;
    }

    return !brokenRule;
};

validators.push(validate);

defineExpose({
    focus,
    validate,
});
</script>

<template>
    <div :class="{ 'relative input-container': true, 'has-value': value != null && value !== '' }">
        <label
            :for="id"
            v-if="label"
            class="label transition-all absolute top-[22%] left-[8px] opacity-50 pointer-events-none"
        >
            {{ label }}
        </label>
        <input
            ref="input"
            :id="id"
            :readonly="readonly"
            :step="step"
            :type="type"
            :name="name"
            :class="{
                [inputClass || '']: true,
                'border-b-2 border-blue-600 bg-black bg-opacity-20 rounded-t p-2 pt-4 outline-none w-full text-base': true,
                'read-only:border-gray-400 read-only:border-dashed read-only:border-b': true,
                'border-red-500': !!errorMessage,
                'transition-colors': true,
            }"
            v-model="value"
        />

        <Transition name="shake">
            <Badge v-if="errorMessage" class="absolute right-3 top-[27%] bg-red-500">
                {{ errorMessage }}
            </Badge>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.input-container {
    &.has-value,
    &:focus-within {
        .label {
            font-size: 0.7em;
            top: 2px;
        }
    }
}

.label {
    font-size: 1em;
}
</style>
