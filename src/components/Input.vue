<script setup lang="ts">
interface Props {
    modelValue?: string | number | null;
    label?: string;
    inputClass?: string;
    type?: string;
    step?: string;
    readonly?: boolean;
    rules?: ((v: any) => string | boolean)[];
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    readonly: false,
});

const validators = inject<(() => boolean)[]>('formValidators', []);
const emit = defineEmits(['update:modelValue']);
const errorMessage = ref<string | null>(null);
const value = ref(props.modelValue);
const input = ref<HTMLInputElement>();

watch(
    () => props.modelValue,
    () => (value.value = props.modelValue)
);

watch(
    () => value.value,
    () => {
        errorMessage.value = null;

        if (value.value !== props.modelValue) {
            emit('update:modelValue', value.value);
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
        <div v-if="label" class="label transition-all absolute top-[22%] left-[8px] opacity-50 pointer-events-none">
            {{ label }}
        </div>
        <input
            ref="input"
            :readonly="readonly"
            :step="step"
            :type="type"
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

.shake-enter-active {
    animation: bounce-in 0.2s;
}
.shake-leave-active {
    animation: bounce-in 0.2s reverse;
}

@keyframes bounce-in {
    0% {
        opacity: 0;
        transform: translateX(20px);
    }

    25% {
        transform: translateX(-10px);
    }

    75% {
        transform: translateX(10px);
    }

    100% {
        transform: translateX(0px);
        opacity: 1;
    }
}
</style>
